

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a real database)
const users = [];
const sessions = {};

// Assessment data (imported from frontend data)
const assessmentData = [
  {
    session_id: "session_004",
    accuracy: 80,
    assessmentResultId: "-OK76ANqAq9pvKSl3ZoN",
    assessment_id: "as_hr_04",
    bodyCompositionData: {
      AGR: "1.687",
      Age: "43",
      BFC: "29.754",
      BMI: "33.145",
      BMR: "2054.217",
      FM: "33.027",
      FMI: "9.862",
      HeightM: "184.091",
      LM: "77.973",
      LMI: "23.283",
      M_Age: "48",
      WHGR: "0.564",
      WHR: "0.926"
    },
    exercises: [
      {
        analysisList: [
          "Shoulders slightly uneven, affecting posture balance.",
          "Head alignment slightly off-center.",
          "Feet aligned properly under shoulders.",
          "Arms hang naturally by the sides."
        ],
        analysisScore: 75,
        assignReps: 1,
        correctReps: 1,
        id: 73,
        name: "Frontal body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 10,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Practice shoulder alignment exercises daily.",
          "Focus on maintaining head center alignment."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        analysisList: [
          "Head leans slightly forward.",
          "Spine shows slight curvature at neck.",
          "Hips aligned over ankles correctly.",
          "Knees are slightly bent, affecting stance."
        ],
        analysisScore: 70,
        assignReps: 1,
        correctReps: 1,
        id: 74,
        name: "Side body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 22,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Engage in neck strengthening exercises.",
          "Consciously practice standing with straight knees."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 10,
        correctReps: 1,
        id: 235,
        name: "Jog test",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "99.17062",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 61,
            totalReps: 1
          }
        ],
        side: "left",
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 45,
        correctReps: 42,
        id: 259,
        name: "Squat",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "93.333336",
                shouldDisplay: false
              },
              {
                fieldName: "reps",
                fieldText: "Reps",
                fieldUnit: "reps",
                fieldValue: "42",
                shouldDisplay: true
              }
            ],
            correctReps: 42,
            incorrectReps: 0,
            isSkipped: false,
            time: 90,
            totalReps: 42
          }
        ],
        side: "left",
        totalReps: 42,
        totalSets: 1,
        variationId: "",
        variationName: ""
      }
    ],
    finalPainScore: "pending",
    gender: "male",
    height: 183,
    initialPainScore: 0,
    initialVAS: 0,
    isLandmarksUploaded: false,
    laterPainScore: "pending",
    timeElapsed: 193,
    timestamp: 1740671597044,
    vitalsMap: {
      api_key: "CNCPg45zbVxGlB7r74xb",
      employee_id: "SCAN_USER",
      entry_time: "2025-02-27 15:53:11.840940+00:00",
      health_risk_score: 16,
      metadata: {
        cardiovascular: {
          cardiac_out: 6.3,
          map: 96,
          prq: 3.57
        },
        fps: 114,
        glucose_info: {
          diabetes_control_score: 57.5,
          hba1c: 5.2,
          status: "beta"
        },
        heart_scores: {
          HRMax: 191,
          HRR: "116",
          THRR: "145 - 191",
          heart_utilized: "40",
          pNN50_per: 47.37,
          rmssd: 23.64,
          sdnn: 45.88,
          stress_index: 1.4,
          zone_details: {
            highZoneRange: 94,
            lowZoneRange: "--",
            zone: "Rest"
          }
        },
        physiological_scores: {
          bloodvolume: "6354.9",
          bmi: "33.15",
          bodyfat: "33.36",
          cal_carb: "93.51",
          cal_fat: "6.49",
          dob: "1999-06-05",
          gender: "male",
          height: "183.0",
          intensity: "Hard",
          tbw: "57.13",
          tbwp: "51.47",
          vo2max: "79.83",
          weight: "111.0"
        }
      },
      posture: "exercising",
      scan_completion_time: "2025-02-27T15:53:16.002564+00:00",
      scan_id: "069da947-4efd-4c31-8169-c02e4de8f639",
      statusCode: 200,
      vitals: {
        bp_dia: 82,
        bp_sys: 124,
        heart_rate: 75,
        oxy_sat_prcnt: 96,
        resp_rate: 21
      },
      wellness_score: 84
    },
    weight: 111
  },
  {
    session_id: "session_003",
    accuracy: 80,
    assessmentResultId: "-OK76ANqAq9pvKSl3ZoN",
    assessment_id: "as_hr_03",
    bodyCompositionData: {
      AGR: "1.687",
      Age: "43",
      BFC: "29.754",
      BMI: "33.145",
      BMR: "2054.217",
      FM: "33.027",
      FMI: "9.862",
      HeightM: "184.091",
      LM: "77.973",
      LMI: "23.283",
      M_Age: "48",
      WHGR: "0.564",
      WHR: "0.926"
    },
    exercises: [
      {
        analysisList: [
          "Shoulders slightly uneven, affecting posture balance.",
          "Head alignment slightly off-center.",
          "Feet aligned properly under shoulders.",
          "Arms hang naturally by the sides."
        ],
        analysisScore: 75,
        assignReps: 1,
        correctReps: 1,
        id: 73,
        name: "Frontal body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 10,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Practice shoulder alignment exercises daily.",
          "Focus on maintaining head center alignment."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        analysisList: [
          "Head leans slightly forward.",
          "Spine shows slight curvature at neck.",
          "Hips aligned over ankles correctly.",
          "Knees are slightly bent, affecting stance."
        ],
        analysisScore: 70,
        assignReps: 1,
        correctReps: 1,
        id: 74,
        name: "Side body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 22,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Engage in neck strengthening exercises.",
          "Consciously practice standing with straight knees."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 10,
        correctReps: 1,
        id: 235,
        name: "Jog test",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "99.17062",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 61,
            totalReps: 1
          }
        ],
        side: "left",
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 45,
        correctReps: 42,
        id: 259,
        name: "Squat",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "93.333336",
                shouldDisplay: false
              },
              {
                fieldName: "reps",
                fieldText: "Reps",
                fieldUnit: "reps",
                fieldValue: "42",
                shouldDisplay: true
              }
            ],
            correctReps: 42,
            incorrectReps: 0,
            isSkipped: false,
            time: 90,
            totalReps: 42
          }
        ],
        side: "left",
        totalReps: 42,
        totalSets: 1,
        variationId: "",
        variationName: ""
      }
    ],
    finalPainScore: "pending",
    gender: "male",
    height: 183,
    initialPainScore: 0,
    initialVAS: 0,
    isLandmarksUploaded: false,
    laterPainScore: "pending",
    timeElapsed: 193,
    timestamp: 1740671597044,
    vitalsMap: {
      api_key: "CNCPg45zbVxGlB7r74xb",
      employee_id: "SCAN_USER",
      entry_time: "2025-02-27 15:53:11.840940+00:00",
      health_risk_score: 16,
      metadata: {
        cardiovascular: {
          cardiac_out: 6.3,
          map: 96,
          prq: 3.57
        },
        fps: 114,
        glucose_info: {
          diabetes_control_score: 57.5,
          hba1c: 5.2,
          status: "beta"
        },
        heart_scores: {
          HRMax: 191,
          HRR: "116",
          THRR: "145 - 191",
          heart_utilized: "40",
          pNN50_per: 47.37,
          rmssd: 23.64,
          sdnn: 45.88,
          stress_index: 1.4,
          zone_details: {
            highZoneRange: 94,
            lowZoneRange: "--",
            zone: "Rest"
          }
        },
        physiological_scores: {
          bloodvolume: "6354.9",
          bmi: "33.15",
          bodyfat: "33.36",
          cal_carb: "93.51",
          cal_fat: "6.49",
          dob: "1999-06-05",
          gender: "male",
          height: "183.0",
          intensity: "Hard",
          tbw: "57.13",
          tbwp: "51.47",
          vo2max: "79.83",
          weight: "111.0"
        }
      },
      posture: "exercising",
      scan_completion_time: "2025-02-27T15:53:16.002564+00:00",
      scan_id: "069da947-4efd-4c31-8169-c02e4de8f639",
      statusCode: 200,
      vitals: {
        bp_dia: 82,
        bp_sys: 124,
        heart_rate: 75,
        oxy_sat_prcnt: 96,
        resp_rate: 21
      },
      wellness_score: 84
    },
    weight: 111
  },
  {
    session_id: "session_001",
    accuracy: 80,
    assessmentResultId: "-OK76ANqAq9pvKSl3ZoN",
    assessment_id: "as_hr_02",
    bodyCompositionData: {
      AGR: "1.687",
      Age: "43",
      BFC: "29.754",
      BMI: "33.145",
      BMR: "2054.217",
      FM: "33.027",
      FMI: "9.862",
      HeightM: "184.091",
      LM: "77.973",
      LMI: "23.283",
      M_Age: "48",
      WHGR: "0.564",
      WHR: "0.926"
    },
    exercises: [
      {
        analysisList: [
          "Shoulders slightly uneven, affecting posture balance.",
          "Head alignment slightly off-center.",
          "Feet aligned properly under shoulders.",
          "Arms hang naturally by the sides."
        ],
        analysisScore: 75,
        assignReps: 1,
        correctReps: 1,
        id: 73,
        name: "Frontal body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 10,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Practice shoulder alignment exercises daily.",
          "Focus on maintaining head center alignment."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        analysisList: [
          "Head leans slightly forward.",
          "Spine shows slight curvature at neck.",
          "Hips aligned over ankles correctly.",
          "Knees are slightly bent, affecting stance."
        ],
        analysisScore: 70,
        assignReps: 1,
        correctReps: 1,
        id: 74,
        name: "Side body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0.0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 22,
            totalReps: 1
          }
        ],
        side: "left",
        tipsList: [
          "Engage in neck strengthening exercises.",
          "Consciously practice standing with straight knees."
        ],
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 10,
        correctReps: 1,
        id: 235,
        name: "Jog test",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "99.17062",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 61,
            totalReps: 1
          }
        ],
        side: "left",
        totalReps: 1,
        totalSets: 1,
        variationId: "",
        variationName: ""
      },
      {
        assignReps: 45,
        correctReps: 42,
        id: 259,
        name: "Squat",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "93.333336",
                shouldDisplay: false
              },
              {
                fieldName: "reps",
                fieldText: "Reps",
                fieldUnit: "reps",
                fieldValue: "42",
                shouldDisplay: true
              }
            ],
            correctReps: 42,
            incorrectReps: 0,
            isSkipped: false,
            time: 90,
            totalReps: 42
          }
        ],
        side: "left",
        totalReps: 42,
        totalSets: 1,
        variationId: "",
        variationName: ""
      }
    ],
    finalPainScore: "pending",
    gender: "male",
    height: 183,
    initialPainScore: 0,
    initialVAS: 0,
    isLandmarksUploaded: false,
    laterPainScore: "pending",
    timeElapsed: 193,
    timestamp: 1740671597044,
    vitalsMap: {
      api_key: "CNCPg45zbVxGlB7r74xb",
      employee_id: "SCAN_USER",
      entry_time: "2025-02-27 15:53:11.840940+00:00",
      health_risk_score: 16,
      metadata: {
        cardiovascular: {
          cardiac_out: 6.3,
          map: 96,
          prq: 3.57
        },
        fps: 114,
        glucose_info: {
          diabetes_control_score: 57.5,
          hba1c: 5.2,
          status: "beta"
        },
        heart_scores: {
          HRMax: 191,
          HRR: "116",
          THRR: "145 - 191",
          heart_utilized: "40",
          pNN50_per: 47.37,
          rmssd: 23.64,
          sdnn: 45.88,
          stress_index: 1.4,
          zone_details: {
            highZoneRange: 94,
            lowZoneRange: "--",
            zone: "Rest"
          }
        },
        physiological_scores: {
          bloodvolume: "6354.9",
          bmi: "33.15",
          bodyfat: "33.36",
          cal_carb: "93.51",
          cal_fat: "6.49",
          dob: "1999-06-05",
          gender: "male",
          height: "183.0",
          intensity: "Hard",
          tbw: "57.13",
          tbwp: "51.47",
          vo2max: "79.83",
          weight: "111.0"
        }
      },
      posture: "exercising",
      scan_completion_time: "2025-02-27T15:53:16.002564+00:00",
      scan_id: "069da947-4efd-4c31-8169-c02e4de8f639",
      statusCode: 200,
      vitals: {
        bp_dia: 82,
        bp_sys: 124,
        heart_rate: 75,
        oxy_sat_prcnt: 96,
        resp_rate: 21
      },
      wellness_score: 84
    },
    weight: 111
  },
  {
    session_id: "session_002",
    accuracy: 17,
    assessmentResultId: "-OTafA4SqUgE6Y5xrqiI",
    assessment_id: "as_card_01",
    bodyCompositionData: {
      AGR: "0.90",
      BFC: "-0.90",
      BMI: "9.51",
      BMR: "995.39",
      FM: "-0.18",
      FMI: "-0.09",
      LM: "20.18",
      LMI: "9.60",
      M_Age: "15",
      WHGR: "0.37",
      WHR: "1.01"
    },
    exercises: [
      {
        assignReps: 1,
        correctReps: 1,
        id: 73,
        name: "Frontal body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 10,
            totalReps: 1
          }
        ],
        side: "left",
        totalReps: 1,
        totalSets: 1,
        variationId: "\"\"",
        variationName: "\"\""
      },
      {
        assignReps: 1,
        correctReps: 1,
        id: 74,
        name: "Side body view",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "0",
                shouldDisplay: false
              }
            ],
            correctReps: 1,
            incorrectReps: 0,
            isSkipped: false,
            time: 10,
            totalReps: 1
          }
        ],
        side: "left",
        totalReps: 1,
        totalSets: 1,
        variationId: "\"\"",
        variationName: "\"\""
      },
      {
        assignReps: 10,
        correctReps: 0,
        id: 235,
        name: "Jog test",
        setList: [
          {
            additionalFields: [
              {
                fieldName: "accuracy",
                fieldText: "Score",
                fieldUnit: "%",
                fieldValue: "15.164222764530614",
                shouldDisplay: false
              }
            ],
            correctReps: 0,
            incorrectReps: 0,
            isSkipped: false,
            time: 47,
            totalReps: 0
          }
        ],
        side: "left",
        totalReps: 0,
        totalSets: 1,
        variationId: "\"\"",
        variationName: "\"\""
      }
    ],
    finalPainScore: "pending",
    gender: "male",
    height: 145,
    initialPainScore: 0,
    initialVAS: 0,
    isLandmarksUploaded: false,
    laterPainScore: "pending",
    timeElapsed: 67,
    timestamp: 1750848025493,
    vitalsMap: {
      api_key: "CNCPg45zbVxGlB7r74xb",
      employee_id: "SCAN_USER",
      entry_time: "2024-09-26 07:26:15.188795+00:00",
      health_risk_score: 16,
      metadata: {
        cardiovascular: {
          cardiac_out: 5.68,
          map: 95.33,
          prq: 3.47
        },
        fps: 114,
        glucose_info: {
          diabetes_control_score: 77.5,
          hba1c: 5.2,
          status: "beta"
        },
        heart_scores: {
          HRMax: 191,
          HRR: "125",
          THRR: "< 90",
          heart_utilized: "45",
          pNN50_per: 37.66,
          rmssd: 27.12,
          sdnn: 50.81,
          stress_index: 1.6,
          zone_details: {
            highZoneRange: 94,
            lowZoneRange: "--",
            zone: "Rest"
          }
        },
        physiological_scores: {
          bloodvolume: "5414.04",
          bmi: "26.23",
          bodyfat: "23.4",
          cal_carb: "--",
          cal_fat: "--",
          dob: "1999-06-05",
          gender: "male",
          height: "180.0",
          intensity: "Very Light",
          tbw: "48.07",
          tbwp: "56.55",
          vo2max: "44.08",
          weight: "85.0"
        }
      },
      posture: "resting",
      scan_completion_time: "2024-09-26T07:26:16.821174+00:00",
      scan_id: "ce310698-d79a-4cd2-9df7-60de836d2786",
      statusCode: 200,
      user_id: "1abc0416-e7bd-47b3-9098-696d35f79408",
      vitals: {
        bp_dia: 75,
        bp_sys: 110,
        heart_rate: 66,
        oxy_sat_prcnt: 95,
        resp_rate: 19
      },
      wellness_score: 84
    },
    weight: 20
  }
];

// Assessment configurations
const assessmentConfigurations = [
   {
    assessment_id: "as_hr_04",
    name: "Fourth assessment",
    description: "Fourth assesment health and fitness evaluation",
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
            format: "number"
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
            label: "Body Fat Percentage",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
            format: "string"
          }
        ]
      }
    ]
  },
   {
    assessment_id: "as_hr_03",
    name: "Third assessment",
    description: "Thrid assesment health and fitness evaluation",
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
            format: "number"
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
            label: "Body Fat Percentage",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
            format: "string"
          }
        ]
      }
    ]
  },
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
            format: "number"
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
            label: "Body Fat Percentage",
            jsonPath: "bodyCompositionData.BFC",
            unit: "%",
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
            format: "percentage"
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
            format: "number"
          },
          {
            label: "Blood Pressure (Systolic)",
            jsonPath: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
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
          }
        ]
      }
    ]
  }
];

// Data extraction utility
class DataExtractor {
  static extractValue(data, jsonPath) {
    try {
      if (!jsonPath.includes('[') && !jsonPath.includes('?')) {
        return this.getNestedValue(data, jsonPath.split('.'));
      }

      if (jsonPath.includes('[?(@.')) {
        return this.extractWithFilter(data, jsonPath);
      }

      return this.getNestedValue(data, jsonPath.split('.'));
    } catch (error) {
      console.warn(`Failed to extract value for path: ${jsonPath}`, error);
      return null;
    }
  }

  static getNestedValue(obj, path) {
    return path.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  static extractWithFilter(data, jsonPath) {
    const match = jsonPath.match(/^(.+?)\[\?\(@\.(.+?)===?(.+?)\)\](.*)$/);
    
    if (!match) {
      console.warn(`Invalid filter syntax: ${jsonPath}`);
      return null;
    }

    const [, arrayPath, filterProperty, filterValue, remainingPath] = match;
    
    const array = this.getNestedValue(data, arrayPath.split('.'));
    if (!Array.isArray(array)) {
      return null;
    }

    const numericValue = !isNaN(Number(filterValue)) ? Number(filterValue) : filterValue.replace(/"/g, '');
    const matchingItem = array.find(item => {
      const itemValue = this.getNestedValue(item, filterProperty.split('.'));
      return itemValue == numericValue;
    });

    if (!matchingItem) {
      return null;
    }

    if (remainingPath) {
      return this.getNestedValue(matchingItem, remainingPath.substring(1).split('.'));
    }

    return matchingItem;
  }

  static formatValue(value, format, unit) {
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
      default:
        formattedValue = String(value);
    }

    return unit ? `${formattedValue} ${unit}` : String(formattedValue);
  }

  static classifyValue(value, classification) {
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

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  });
});

// PDF Report Generation
app.post('/api/generate-report', authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    // Find assessment data
    const sessionData = assessmentData.find(data => data.session_id === session_id);
    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get assessment configuration
    const config = assessmentConfigurations.find(config => config.assessment_id === sessionData.assessment_id);
    if (!config) {
      return res.status(404).json({ error: 'Assessment configuration not found' });
    }

    // Generate HTML content
    const htmlContent = generateReportHTML(sessionData, config);

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const fileName = `${session_id}_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    res.json({
      message: 'Report generated successfully',
      fileName,
      filePath: filePath,
      sessionId: session_id,
      assessmentType: config.name
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Get available sessions for testing
app.get('/api/sessions', authenticateToken, (req, res) => {
  const sessions = assessmentData.map(data => ({
    session_id: data.session_id,
    assessment_id: data.assessment_id,
    assessment_type: assessmentConfigurations.find(config => config.assessment_id === data.assessment_id)?.name || 'Unknown'
  }));

  res.json(sessions);
});

// Function to generate HTML content for PDF
function generateReportHTML(sessionData, config) {
  let sectionsHTML = '';

  config.sections.forEach(section => {
    let fieldsHTML = '';
    
    section.fields.forEach(field => {
      const value = DataExtractor.extractValue(sessionData, field.jsonPath);
      const formattedValue = DataExtractor.formatValue(value, field.format, field.unit);
      const classification = DataExtractor.classifyValue(value, field.classification);
      
      const classificationHTML = classification 
        ? `<span class="classification" style="color: ${classification.color}; font-weight: bold;">(${classification.label})</span>`
        : '';

      fieldsHTML += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${field.label}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${formattedValue} ${classificationHTML}</td>
        </tr>
      `;
    });

    sectionsHTML += `
      <div class="section" style="margin-bottom: 24px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 16px;">${section.title}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${fieldsHTML}
        </table>
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.name} Report</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #374151;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 3px solid #3b82f6;
        }
        .header h1 {
          color: #1f2937;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #6b7280;
          margin: 8px 0 0 0;
          font-style: italic;
        }
        .meta-info {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meta-info div {
          text-align: center;
        }
        .meta-info .label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .meta-info .value {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          margin-top: 4px;
        }
        .section {
          margin-bottom: 24px;
        }
        .section h2 {
          color: #1f2937;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 8px;
          margin-bottom: 16px;
          font-size: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        tr:last-child td {
          border-bottom: none;
        }
        .classification {
          margin-left: 8px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${config.name}</h1>
        <p>${config.description}</p>
      </div>

      <div class="meta-info">
        <div>
          <div class="label">Session ID</div>
          <div class="value">${sessionData.session_id}</div>
        </div>
        <div>
          <div class="label">Assessment ID</div>
          <div class="value">${sessionData.assessment_id}</div>
        </div>
        <div>
          <div class="label">Generated On</div>
          <div class="value">${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      ${sectionsHTML}

      <div class="footer">
        <p>Report generated by Assessment Management System</p>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});