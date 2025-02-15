export type EventSeverity = "high" | "medium" | "low";

export interface Event {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  severity: EventSeverity;
  type: EventType;
}

export type EventType = 
  | "ACCESS_BREACH"
  | "BIOMETRIC_ALERT"
  | "SYSTEM_UPDATE"
  | "COMMUNICATION_ISSUE"
  | "MOVEMENT_DETECTED"
  | "ENVIRONMENTAL_ALERT"
  | "EQUIPMENT_MALFUNCTION"
  | "MISSION_UPDATE";

interface EventTemplate {
  title: string;
  description: string;
  defaultSeverity: EventSeverity;
  variables?: string[];
}

export const EVENT_TEMPLATES: Record<EventType, EventTemplate> = {
  ACCESS_BREACH: {
    title: "Unauthorized Access Detected",
    description: "Security breach attempt detected at {location}. {action}.",
    defaultSeverity: "high",
    variables: ["location", "action"]
  },
  BIOMETRIC_ALERT: {
    title: "Biometric Anomaly",
    description: "Unit {unitName} showing {condition} during {activity}. {response}.",
    defaultSeverity: "medium",
    variables: ["unitName", "condition", "activity", "response"]
  },
  SYSTEM_UPDATE: {
    title: "System Update",
    description: "{system} successfully updated. {status}.",
    defaultSeverity: "low",
    variables: ["system", "status"]
  },
  COMMUNICATION_ISSUE: {
    title: "Communication Disruption",
    description: "{issue} with Unit {unitName} in {location}. {action}.",
    defaultSeverity: "high",
    variables: ["issue", "unitName", "location", "action"]
  },
  MOVEMENT_DETECTED: {
    title: "Suspicious Movement",
    description: "{movementType} detected in {location}. {response}.",
    defaultSeverity: "medium",
    variables: ["movementType", "location", "response"]
  },
  ENVIRONMENTAL_ALERT: {
    title: "Environmental Warning",
    description: "{condition} detected in {location}. {impact}. {action}.",
    defaultSeverity: "medium",
    variables: ["condition", "location", "impact", "action"]
  },
  EQUIPMENT_MALFUNCTION: {
    title: "Equipment Alert",
    description: "{equipment} malfunction reported by Unit {unitName}. {impact}. {action}.",
    defaultSeverity: "medium",
    variables: ["equipment", "unitName", "impact", "action"]
  },
  MISSION_UPDATE: {
    title: "Mission Status Change",
    description: "Unit {unitName} {status} in {location}. {details}.",
    defaultSeverity: "low",
    variables: ["unitName", "status", "location", "details"]
  }
};

// Sample variable values for each event type
export const VARIABLE_VALUES = {
  locations: [
    "Sector 7",
    "Sector 12",
    "Base Perimeter",
    "Training Ground",
    "Command Center",
    "Storage Facility",
    "Research Lab"
  ],
  unitNames: [
    "Alpha",
    "Beta",
    "Delta",
    "Gamma",
    "Epsilon",
    "Omega"
  ],
  actions: [
    "Security protocols engaged",
    "Backup systems activated",
    "Investigation initiated",
    "Containment measures implemented",
    "Emergency response deployed"
  ],
  conditions: [
    "elevated heart rate patterns",
    "irregular breathing patterns",
    "abnormal stress levels",
    "unusual movement patterns",
    "unexpected vital signs"
  ],
  activities: [
    "routine patrol",
    "training exercise",
    "mission execution",
    "equipment maintenance",
    "tactical operation"
  ],
  responses: [
    "Medical team notified",
    "Supervisory review required",
    "Monitoring increased",
    "Support team dispatched",
    "Protocol review initiated"
  ],
  systems: [
    "Automated security protocols",
    "Communication systems",
    "Biometric monitoring",
    "Environmental controls",
    "Access control systems"
  ],
  statuses: [
    "No disruption to operations",
    "Minimal impact on functionality",
    "Performance optimization complete",
    "System efficiency improved",
    "Updates successfully deployed"
  ],
  issues: [
    "Temporary loss of communication",
    "Signal interference detected",
    "Data transmission delay",
    "Connection instability",
    "Communication blackout"
  ],
  movementTypes: [
    "Unauthorized personnel",
    "Unidentified vehicle",
    "Aerial activity",
    "Perimeter breach attempt",
    "Restricted zone entry"
  ],
  equipment: [
    "Tactical gear",
    "Communication device",
    "Sensor array",
    "Protective equipment",
    "Monitoring system"
  ],
  impacts: [
    "Operational capacity reduced",
    "System performance affected",
    "Safety measures activated",
    "Efficiency decreased",
    "Functionality limited"
  ],
  missionStatuses: [
    "completed objective",
    "encountered resistance",
    "requires backup",
    "advancing position",
    "maintaining surveillance"
  ],
  details: [
    "Awaiting further orders",
    "Situation under control",
    "Additional resources required",
    "Proceeding as planned",
    "Strategic reassessment needed"
  ]
};

export function generateEventDescription(
  type: EventType,
  variables: Record<string, string>
): string {
  let description = EVENT_TEMPLATES[type].description;
  
  Object.entries(variables).forEach(([key, value]) => {
    description = description.replace(`{${key}}`, value);
  });
  
  return description;
}

// Helper function to get random item from array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

interface PredefinedEvent {
  type: EventType;
  variables: Record<string, string>;
}

// Predefined event data with fixed timestamps
const PREDEFINED_EVENTS: (PredefinedEvent & { timestamp: string })[] = [
  {
    type: "ACCESS_BREACH",
    timestamp: "2024-02-15T11:13:42Z",
    variables: {
      location: "Sector 7",
      action: "Security protocols engaged"
    }
  },
  {
    type: "BIOMETRIC_ALERT",
    timestamp: "2024-02-15T11:12:15Z",
    variables: {
      unitName: "Delta",
      condition: "elevated heart rate patterns",
      activity: "routine patrol",
      response: "Medical team notified"
    }
  },
  {
    type: "SYSTEM_UPDATE",
    timestamp: "2024-02-15T11:10:33Z",
    variables: {
      system: "Automated security protocols",
      status: "No disruption to operations"
    }
  },
  {
    type: "COMMUNICATION_ISSUE",
    timestamp: "2024-02-15T11:08:59Z",
    variables: {
      issue: "Temporary loss of communication",
      unitName: "Beta",
      location: "Sector 12",
      action: "Backup systems activated"
    }
  }
];

// Function to generate events from predefined data
export function generateEvent(id: number): Event {
  const eventData = PREDEFINED_EVENTS[id - 1];
  const template = EVENT_TEMPLATES[eventData.type];
  
  return {
    id,
    timestamp: eventData.timestamp,
    title: template.title,
    description: generateEventDescription(eventData.type, eventData.variables),
    severity: template.defaultSeverity,
    type: eventData.type
  };
}

// Function to generate all predefined events
export function generatePredefinedEvents(): Event[] {
  return PREDEFINED_EVENTS.map((_, index) => generateEvent(index + 1));
}
