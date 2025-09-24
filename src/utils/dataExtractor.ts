// Utility for extracting data using JSON path notation
export class DataExtractor {
  static extractValue(data: any, jsonPath: string): any {
    try {
      // Handle simple property paths
      if (!jsonPath.includes('[') && !jsonPath.includes('?')) {
        return this.getNestedValue(data, jsonPath.split('.'));
      }

      // Handle array queries with filters (JSONPath-like syntax)
      if (jsonPath.includes('[?(@.')) {
        return this.extractWithFilter(data, jsonPath);
      }

      // Handle array index access
      if (jsonPath.includes('[') && jsonPath.includes(']')) {
        return this.extractWithArrayAccess(data, jsonPath);
      }

      return this.getNestedValue(data, jsonPath.split('.'));
    } catch (error) {
      console.warn(`Failed to extract value for path: ${jsonPath}`, error);
      return null;
    }
  }

  private static getNestedValue(obj: any, path: string[]): any {
    return path.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private static extractWithFilter(data: any, jsonPath: string): any {
    // Parse JSONPath with filter: exercises[?(@.id==235)].setList[0].time
    const match = jsonPath.match(/^(.+?)\[\?\(@\.(.+?)===?(.+?)\)\](.*)$/);
    
    if (!match) {
      console.warn(`Invalid filter syntax: ${jsonPath}`);
      return null;
    }

    const [, arrayPath, filterProperty, filterValue, remainingPath] = match;
    
    // Get the array
    const array = this.getNestedValue(data, arrayPath.split('.'));
    if (!Array.isArray(array)) {
      return null;
    }

    // Find matching item
    const numericValue = !isNaN(Number(filterValue)) ? Number(filterValue) : filterValue.replace(/"/g, '');
    const matchingItem = array.find(item => {
      const itemValue = this.getNestedValue(item, filterProperty.split('.'));
      return itemValue == numericValue;
    });

    if (!matchingItem) {
      return null;
    }

    // Extract remaining path from matching item
    if (remainingPath) {
      return this.getNestedValue(matchingItem, remainingPath.substring(1).split('.'));
    }

    return matchingItem;
  }

  private static extractWithArrayAccess(data: any, jsonPath: string): any {
    const parts = jsonPath.split('.');
    let current = data;

    for (const part of parts) {
      if (part.includes('[') && part.includes(']')) {
        const arrayName = part.substring(0, part.indexOf('['));
        const index = parseInt(part.substring(part.indexOf('[') + 1, part.indexOf(']')));
        
        current = current[arrayName];
        if (Array.isArray(current) && current[index] !== undefined) {
          current = current[index];
        } else {
          return null;
        }
      } else {
        current = current && current[part] !== undefined ? current[part] : null;
      }
    }

    return current;
  }

  static formatValue(value: any, format?: string, unit?: string): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    let formattedValue = value;

    switch (format) {
      case 'number':
        formattedValue = typeof value === 'string' ? parseFloat(value) : value;
        formattedValue = isNaN(formattedValue) ? value : formattedValue.toFixed(1);
        break;
      case 'percentage':
        formattedValue = typeof value === 'string' ? parseFloat(value) : value;
        formattedValue = isNaN(formattedValue) ? value : formattedValue.toFixed(1);
        break;
      case 'date':
        formattedValue = new Date(value).toLocaleDateString();
        break;
      default:
        formattedValue = String(value);
    }

    return unit ? `${formattedValue} ${unit}` : String(formattedValue);
  }

  static classifyValue(value: any, classification?: { ranges: Array<{ min: number; max: number; label: string; color: string; }> }): { label: string; color: string } | null {
    if (!classification || value === null || value === undefined) {
      return null;
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return null;
    }

    const range = classification.ranges.find(range => numValue >= range.min && numValue <= range.max);
    return range ? { label: range.label, color: range.color } : null;
  }
}