// Assessment configuration system - completely configuration-driven
export interface FieldMapping {
  label: string;
  jsonPath: string;
  unit?: string;
  format?: 'number' | 'string' | 'percentage' | 'date';
  classification?: {
    ranges: Array<{
      min: number;
      max: number;
      label: string;
      color: string;
    }>;
  };
}

export interface SectionConfig {
  title: string;
  fields: FieldMapping[];
  template?: string;
}

export interface AssessmentConfig {
  assessment_id: string;
  name: string;
  description: string;
  sections: SectionConfig[];
}

// Configuration for different assessment types
export const assessmentConfigurations: AssessmentConfig[] = [
  {
    assessment_id: "as_hr_02",
    name: "Health & Fitness Assessment",
    description: "Comprehensive health and fitness evaluation",
    sections: [
      {
        title: "Overview",
        fields: [
          {
            label: "Overall Health Score",
            jsonPath: "accuracy",
            unit: "%",
            format: "percentage",
            classification: {
              ranges: [
                { min: 0, max: 40, label: "Poor", color: "#ef4444" },
                { min: 40, max: 60, label: "Fair", color: "#f97316" },
                { min: 60, max: 80, label: "Good", color: "#eab308" },
                { min: 80, max: 100, label: "Excellent", color: "#22c55e" }
              ]
            }
          },
          {
            label: "Assessment Type",
            jsonPath: "assessment_id",
            format: "string"
          },
          {
            label: "Time Elapsed",
            jsonPath: "timeElapsed",
            unit: "seconds",
            format: "number"
          }
        ]
      },
      {
        title: "Key Body Vitals",
        fields: [
          {
            label: "Heart Rate",
            jsonPath: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            format: "number",
            classification: {
              ranges: [
                { min: 60, max: 100, label: "Normal", color: "#22c55e" },
                { min: 100, max: 120, label: "Elevated", color: "#eab308" },
                { min: 120, max: 200, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Blood Pressure (Systolic)",
            jsonPath: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
            format: "number",
            classification: {
              ranges: [
                { min: 90, max: 120, label: "Normal", color: "#22c55e" },
                { min: 120, max: 140, label: "Elevated", color: "#eab308" },
                { min: 140, max: 200, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Blood Pressure (Diastolic)",
            jsonPath: "vitalsMap.vitals.bp_dia",
            unit: "mmHg",
            format: "number",
            classification: {
              ranges: [
                { min: 60, max: 80, label: "Normal", color: "#22c55e" },
                { min: 80, max: 90, label: "Elevated", color: "#eab308" },
                { min: 90, max: 120, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Oxygen Saturation",
            jsonPath: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            format: "percentage"
          },
          {
            label: "Respiratory Rate",
            jsonPath: "vitalsMap.vitals.resp_rate",
            unit: "breaths/min",
            format: "number"
          }
        ]
      },
      {
        title: "Heart Health",
        fields: [
          {
            label: "Max Heart Rate",
            jsonPath: "vitalsMap.metadata.heart_scores.HRMax",
            unit: "bpm",
            format: "number"
          },
          {
            label: "Heart Rate Reserve",
            jsonPath: "vitalsMap.metadata.heart_scores.HRR",
            unit: "bpm",
            format: "string"
          },
          {
            label: "Target Heart Rate Range",
            jsonPath: "vitalsMap.metadata.heart_scores.THRR",
            unit: "bpm",
            format: "string"
          },
          {
            label: "Heart Utilization",
            jsonPath: "vitalsMap.metadata.heart_scores.heart_utilized",
            unit: "%",
            format: "string"
          }
        ]
      },
      {
        title: "Stress Level",
        fields: [
          {
            label: "Stress Index",
            jsonPath: "vitalsMap.metadata.heart_scores.stress_index",
            format: "number",
            classification: {
              ranges: [
                { min: 0, max: 1.5, label: "Low", color: "#22c55e" },
                { min: 1.5, max: 2.5, label: "Moderate", color: "#eab308" },
                { min: 2.5, max: 5, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "HRV RMSSD",
            jsonPath: "vitalsMap.metadata.heart_scores.rmssd",
            unit: "ms",
            format: "number"
          },
          {
            label: "HRV SDNN",
            jsonPath: "vitalsMap.metadata.heart_scores.sdnn",
            unit: "ms",
            format: "number"
          }
        ]
      },
      {
        title: "Fitness Levels",
        fields: [
          {
            label: "VO2 Max",
            jsonPath: "vitalsMap.metadata.physiological_scores.vo2max",
            unit: "ml/kg/min",
            format: "string"
          },
          {
            label: "Exercise Intensity",
            jsonPath: "vitalsMap.metadata.physiological_scores.intensity",
            format: "string"
          },
          {
            label: "Cardiovascular Endurance (Jog Test Time)",
            jsonPath: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            format: "number"
          }
        ]
      },
      {
        title: "Posture Analysis",
        fields: [
          {
            label: "Frontal View Score",
            jsonPath: "exercises[?(@.id==73)].analysisScore",
            unit: "%",
            format: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "#ef4444" },
                { min: 50, max: 70, label: "Fair", color: "#f97316" },
                { min: 70, max: 85, label: "Good", color: "#eab308" },
                { min: 85, max: 100, label: "Excellent", color: "#22c55e" }
              ]
            }
          },
          {
            label: "Side View Score",
            jsonPath: "exercises[?(@.id==74)].analysisScore",
            unit: "%",
            format: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "#ef4444" },
                { min: 50, max: 70, label: "Fair", color: "#f97316" },
                { min: 70, max: 85, label: "Good", color: "#eab308" },
                { min: 85, max: 100, label: "Excellent", color: "#22c55e" }
              ]
            }
          }
        ]
      },
      {
        title: "Body Composition",
        fields: [
          {
            label: "BMI",
            jsonPath: "bodyCompositionData.BMI",
            unit: "kg/m²",
            format: "string",
            classification: {
              ranges: [
                { min: 0, max: 18.5, label: "Underweight", color: "#3b82f6" },
                { min: 18.5, max: 25, label: "Normal", color: "#22c55e" },
                { min: 25, max: 30, label: "Overweight", color: "#eab308" },
                { min: 30, max: 50, label: "Obese", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Body Fat Percentage",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
            format: "string"
          },
          {
            label: "Basal Metabolic Rate",
            jsonPath: "bodyCompositionData.BMR",
            unit: "calories/day",
            format: "string"
          },
          {
            label: "Fat Mass",
            jsonPath: "bodyCompositionData.FM",
            unit: "kg",
            format: "string"
          },
          {
            label: "Lean Mass",
            jsonPath: "bodyCompositionData.LM",
            unit: "kg",
            format: "string"
          }
        ]
      }
    ]
  },
  {
    assessment_id: "as_card_01",
    name: "Cardiac Assessment",
    description: "Focused cardiac health evaluation",
    sections: [
      {
        title: "Overview",
        fields: [
          {
            label: "Overall Assessment Score",
            jsonPath: "accuracy",
            unit: "%",
            format: "percentage",
            classification: {
              ranges: [
                { min: 0, max: 25, label: "Critical", color: "#ef4444" },
                { min: 25, max: 50, label: "Poor", color: "#f97316" },
                { min: 50, max: 75, label: "Fair", color: "#eab308" },
                { min: 75, max: 100, label: "Good", color: "#22c55e" }
              ]
            }
          },
          {
            label: "Assessment Type",
            jsonPath: "assessment_id",
            format: "string"
          }
        ]
      },
      {
        title: "Key Body Vitals",
        fields: [
          {
            label: "Heart Rate",
            jsonPath: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            format: "number",
            classification: {
              ranges: [
                { min: 60, max: 100, label: "Normal", color: "#22c55e" },
                { min: 100, max: 120, label: "Elevated", color: "#eab308" },
                { min: 120, max: 200, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Blood Pressure (Systolic)",
            jsonPath: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Blood Pressure (Diastolic)",
            jsonPath: "vitalsMap.vitals.bp_dia",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Oxygen Saturation",
            jsonPath: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            format: "percentage"
          }
        ]
      },
      {
        title: "Cardiovascular Endurance",
        fields: [
          {
            label: "Cardiac Output",
            jsonPath: "vitalsMap.metadata.cardiovascular.cardiac_out",
            unit: "L/min",
            format: "number"
          },
          {
            label: "Mean Arterial Pressure",
            jsonPath: "vitalsMap.metadata.cardiovascular.map",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Cardiovascular Test Duration",
            jsonPath: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            format: "number"
          }
        ]
      },
      {
        title: "Body Composition",
        fields: [
          {
            label: "BMI",
            jsonPath: "bodyCompositionData.BMI",
            unit: "kg/m²",
            format: "string"
          },
          {
            label: "Body Fat Content",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
            format: "string"
          },
          {
            label: "Lean Mass",
            jsonPath: "bodyCompositionData.LM",
            unit: "kg",
            format: "string"
          }
        ]
      }
    ]
  },
  {
    assessment_id: "as_card_03",
    name: "Cardiac Assessment",
    description: "Focused cardiac health evaluation",
    sections: [
      {
        title: "Overview",
        fields: [
          {
            label: "Overall Assessment Score",
            jsonPath: "accuracy",
            unit: "%",
            format: "percentage",
            classification: {
              ranges: [
                { min: 0, max: 25, label: "Critical", color: "#ef4444" },
                { min: 25, max: 50, label: "Poor", color: "#f97316" },
                { min: 50, max: 75, label: "Fair", color: "#eab308" },
                { min: 75, max: 100, label: "Good", color: "#22c55e" }
              ]
            }
          },
          {
            label: "Assessment Type",
            jsonPath: "assessment_id",
            format: "string"
          }
        ]
      },
      {
        title: "Key Body Vitals",
        fields: [
          {
            label: "Heart Rate",
            jsonPath: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            format: "number",
            classification: {
              ranges: [
                { min: 60, max: 100, label: "Normal", color: "#22c55e" },
                { min: 100, max: 120, label: "Elevated", color: "#eab308" },
                { min: 120, max: 200, label: "High", color: "#ef4444" }
              ]
            }
          },
          {
            label: "Blood Pressure (Systolic)",
            jsonPath: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Blood Pressure (Diastolic)",
            jsonPath: "vitalsMap.vitals.bp_dia",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Oxygen Saturation",
            jsonPath: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            format: "percentage"
          }
        ]
      },
      {
        title: "Cardiovascular Endurance",
        fields: [
          {
            label: "Cardiac Output",
            jsonPath: "vitalsMap.metadata.cardiovascular.cardiac_out",
            unit: "L/min",
            format: "number"
          },
          {
            label: "Mean Arterial Pressure",
            jsonPath: "vitalsMap.metadata.cardiovascular.map",
            unit: "mmHg",
            format: "number"
          },
          {
            label: "Cardiovascular Test Duration",
            jsonPath: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            format: "number"
          }
        ]
      },
      {
        title: "Body Composition",
        fields: [
          {
            label: "BMI",
            jsonPath: "bodyCompositionData.BMI",
            unit: "kg/m²",
            format: "string"
          },
          {
            label: "Body Fat Content",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
            format: "string"
          },
          {
            label: "Lean Mass",
            jsonPath: "bodyCompositionData.LM",
            unit: "kg",
            format: "string"
          }
        ]
      }
    ]
  }
  
];

// Helper function to get configuration by assessment_id
export const getAssessmentConfig = (assessment_id: string): AssessmentConfig | undefined => {
  return assessmentConfigurations.find(config => config.assessment_id === assessment_id);
};