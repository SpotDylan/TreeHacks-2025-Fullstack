interface Event {
  id: string;
  type: 'status' | 'agent' | 'alert';
  timestamp: string;
  title: string;
  description: string;
}

export interface MockSoldier {
  id: string;
  name: string;
  codeName: string;
  rank: string;
  unit: string;
  heartRate: number;
  lastPing: Date;
  initialPosition: [number, number];
  currentPosition: [number, number];
  coordinates: {
    lat: number;
    lng: number;
  };
  ppgWaveform: number[];
  weight: string;
  height: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  preExistingConditions: string[];
  events: Event[];
  steps: number;
  event: string;
}

const ranks = [
  "Private First Class",
  "Corporal",
  "Sergeant",
  "Staff Sergeant",
  "Sergeant First Class"
];

const units = [
  "1st Infantry Division",
  "2nd Armored Division",
  "3rd Special Forces Group",
  "4th Military Police Battalion",
  "5th Marine Regiment"
];

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const allergies = ["Penicillin", "Sulfa", "Iodine", "Latex", "None"];
const medications = ["None", "Ibuprofen", "Acetaminophen", "Antihistamine"];
const conditions = ["None", "Asthma", "Hypertension", "Type 1 Diabetes"];

function generatePPGWaveform(): number[] {
  // Generate a simple sine wave with some noise
  return Array.from({ length: 50 }, (_, i) => {
    const base = Math.sin(i * 0.2) * 0.5 + 0.5;
    const noise = Math.random() * 0.1;
    return base + noise;
  });
}

function generateMockEvent(soldierId: string): Event {
  return {
    id: `event-${Math.random().toString(36).substr(2, 9)}`,
    type: Math.random() > 0.7 ? 'alert' : Math.random() > 0.5 ? 'agent' : 'status',
    timestamp: new Date().toISOString(),
    title: events[Math.floor(Math.random() * events.length)],
    description: `Routine update for soldier ${soldierId}`
  };
}

const events = [
  "Patrolling area",
  "Investigating disturbance",
  "Securing perimeter",
  "Routine check",
  "Monitoring activity",
  "Standing guard",
  "Equipment check",
  "Radio check",
  "Surveillance duty",
  "Position report"
];

// Stanford coordinates: 37.4277° N, 122.1701° W
const BASE_LAT = 37.4277;
const BASE_LNG = -122.1701;

// Generate a random position within ~500m of the base position
function generateNearbyPosition(): [number, number] {
  // 0.005 degrees is roughly 500 meters
  const lat = BASE_LAT + (Math.random() - 0.5) * 0.005;
  const lng = BASE_LNG + (Math.random() - 0.5) * 0.005;
  return [lat, lng];
}

// Generate a random walk step (small movement)
function generateStep(currentPosition: [number, number]): [number, number] {
  // 0.0002 degrees is roughly 20 meters
  const lat = currentPosition[0] + (Math.random() - 0.5) * 0.0002;
  const lng = currentPosition[1] + (Math.random() - 0.5) * 0.0002;
  return [lat, lng];
}

// Generate mock soldiers
export const mockSoldiers: MockSoldier[] = Array.from({ length: 12 }, (_, i) => {
  const position = generateNearbyPosition();
  const mockEvents = Array.from({ length: 5 }, () => generateMockEvent(`demo-soldier-${i + 1}`));
  return {
    id: `demo-soldier-${i + 1}`,
    name: `Demo Soldier ${i + 1}`,
    codeName: `Operator ${i + 1}`,
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    unit: units[Math.floor(Math.random() * units.length)],
    heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
    lastPing: new Date(),
    initialPosition: position,
    currentPosition: position,
    coordinates: {
      lat: position[0],
      lng: position[1]
    },
    ppgWaveform: generatePPGWaveform(),
    weight: `${Math.floor(Math.random() * 40) + 140}lbs`, // 140-180 lbs
    height: `${Math.floor(Math.random() * 12) + 66}"`, // 66-78 inches
    bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
    allergies: [allergies[Math.floor(Math.random() * allergies.length)]],
    medications: [medications[Math.floor(Math.random() * medications.length)]],
    preExistingConditions: [conditions[Math.floor(Math.random() * conditions.length)]],
    events: mockEvents,
    steps: 0,
    event: events[Math.floor(Math.random() * events.length)]
  };
});

// Update positions for random walk
export function updateSoldierPositions(soldiers: MockSoldier[]): MockSoldier[] {
  return soldiers.map(soldier => {
    if (soldier.steps >= 15) {
      // Reset to initial position after 15 steps (30 seconds)
      return {
        ...soldier,
      currentPosition: soldier.initialPosition,
      coordinates: {
        lat: soldier.initialPosition[0],
        lng: soldier.initialPosition[1]
      },
      steps: 0,
      event: events[Math.floor(Math.random() * events.length)],
      lastPing: new Date(),
      heartRate: Math.floor(Math.random() * 40) + 60,
      ppgWaveform: generatePPGWaveform(),
      events: [...soldier.events, generateMockEvent(soldier.id)]
      };
    }

    return {
      ...soldier,
      currentPosition: generateStep(soldier.currentPosition),
      coordinates: {
        lat: soldier.currentPosition[0],
        lng: soldier.currentPosition[1]
      },
      steps: soldier.steps + 1,
      event: soldier.steps % 5 === 0 ? events[Math.floor(Math.random() * events.length)] : soldier.event,
      lastPing: new Date(),
      heartRate: Math.floor(Math.random() * 40) + 60,
      ppgWaveform: generatePPGWaveform()
    };
  });
}
