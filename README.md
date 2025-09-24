# Assessment Management System

A comprehensive web application with user authentication and flexible PDF report generation system built with React, TypeScript, Node.js, and Puppeteer.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **PDF Report Generation**: Dynamic PDF generation from assessment data
- **Configuration-Driven System**: Handle different assessment types without code modifications
- **Flexible Field Mapping**: JSON path notation for dynamic data extraction
- **Value Classification**: Configurable ranges for field values with color coding

### Technical Highlights
- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and JWT authentication
- **PDF Generation**: Puppeteer for HTML-to-PDF conversion
- **Data Storage**: File-based storage (simulating database)
- **Responsive Design**: Beautiful UI with glassmorphism effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and setup the project**:
```bash
git clone <repository-url>
cd assessment-management-system
npm install
```

2. **Setup the backend**:
```bash
cd server
npm install
cd ..
```

3. **Start the development servers**:

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📊 Assessment Types Supported

### Health & Fitness Assessment (as_hr_02)
- Overview with health score classification
- Key Body Vitals (heart rate, blood pressure, oxygen saturation)
- Heart Health metrics
- Stress Level indicators
- Fitness Levels including VO2 max
- Posture Analysis scores
- Body Composition data

### Cardiac Assessment (as_card_01)
- Overview with assessment score classification
- Key Body Vitals focused on cardiac health
- Cardiovascular Endurance metrics
- Basic Body Composition data

## 🎯 Core Challenge: Maximum Flexibility

The system is designed to be **completely configuration-driven**:

### Section Configuration
Each assessment type can display different sections without code changes:
```typescript
sections: [
  {
    title: "Key Body Vitals",
    fields: [...]
  },
  {
    title: "Heart Health", 
    fields: [...]
  }
]
```

### Dynamic Field Mapping
Uses JSON path notation to extract any data field:
```typescript
{
  label: "Heart Rate",
  jsonPath: "vitalsMap.vitals.heart_rate",
  unit: "bpm",
  format: "number"
}
```

### Value Classification
Configurable ranges for automatic value categorization:
```typescript
classification: {
  ranges: [
    { min: 0, max: 40, label: "Poor", color: "#ef4444" },
    { min: 40, max: 60, label: "Fair", color: "#f97316" },
    { min: 60, max: 80, label: "Good", color: "#eab308" },
    { min: 80, max: 100, label: "Excellent", color: "#22c55e" }
  ]
}
```

## 🔧 Adding New Assessment Types

To add a new assessment type, simply update the configuration:

1. **Add new configuration** in `src/config/assessmentConfig.ts`:
```typescript
{
  assessment_id: "as_new_01",
  name: "New Assessment Type",
  description: "Description of the new assessment",
  sections: [
    // Define sections and fields
  ]
}
```

2. **Add sample data** in `src/data/assessmentData.ts`

No code changes required - the system automatically handles new assessment types!

## 📁 Project Structure

```
assessment-management-system/
├── src/
│   ├── components/           # React components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── Dashboard.tsx
│   ├── config/              # Configuration files
│   │   └── assessmentConfig.ts
│   ├── data/                # Data storage
│   │   └── assessmentData.ts
│   ├── utils/               # Utilities
│   │   └── dataExtractor.ts
│   └── App.tsx
├── server/                  # Backend server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── reports/            # Generated PDF storage
└── README.md
```

## 🔒 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Report Generation
- `POST /api/generate-report` - Generate PDF report
- `GET /api/sessions` - Get available assessment sessions

### Usage Example
```javascript
// Generate PDF report
const response = await fetch('http://localhost:3001/api/generate-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ session_id: 'session_001' })
});
```

## 🧪 Testing the System

### Sample Data Available
- `session_001` - Health & Fitness Assessment (as_hr_02)
- `session_002` - Cardiac Assessment (as_card_01)

### Test Flow
1. Register/Login to the system
2. View available assessment sessions in the dashboard
3. Click "Generate PDF" for any session
4. PDF will be generated and saved to `server/reports/`

## 🎨 Design Features

- **Glassmorphism UI**: Modern frosted glass effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Responsive Design**: Optimized for all devices
- **Smooth Animations**: Hover states and transitions
- **Professional Typography**: Clear hierarchy and spacing
- **Color-Coded Classifications**: Visual feedback for data ranges

## 🔧 Configuration System Benefits

1. **No Code Changes**: Add new assessment types through configuration only
2. **Flexible Data Mapping**: Extract any field using JSON paths
3. **Dynamic Sections**: Show/hide sections per assessment type
4. **Scalable Architecture**: Easy to extend and maintain
5. **Type Safety**: Full TypeScript support with interfaces

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set up proper JWT secrets
2. **Database Integration**: Replace file storage with real database
3. **File Storage**: Use cloud storage for PDF files
4. **Security**: Implement rate limiting and additional validations
5. **Monitoring**: Add logging and error tracking

## 📄 License

This project is created as a technical assessment demonstration.

---

**Built with ❤️ using React, TypeScript, Node.js, and Puppeteer**