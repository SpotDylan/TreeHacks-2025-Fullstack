"use client";

import { useEffect, useState } from "react";
import PageIllustration from "@/components/page-illustration";
import MapComponent from "./map";
import EventCarousel from "./event-carousel";
import SoldierTimeline from "@/components/soldier-timeline";
import ReadStats from "@/components/read-stats";
import { createClient } from "@/utils/supabase/client";

// Mock data for demonstration
const mockSoldier = {
  name: "John Smith",
  codeName: "Ghost",
  rank: "Staff Sergeant",
  unit: "1st Special Forces Group",
  heartRate: 72,
  lastPing: new Date(),
  coordinates: {
    lat: 37.4275,
    lng: -122.1697
  },
  ppgWaveform: [0.2, 0.3, 0.5, 0.8, 1.0, 0.8, 0.5, 0.3, 0.2, 0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 0.8, 0.5, 0.3, 0.2, 0.1],
  // Medical Information
  weight: "180 lbs",
  height: "6'0\"",
  bloodType: "O+",
  allergies: ["Penicillin"],
  medications: ["Ibuprofen PRN"],
  preExistingConditions: ["Mild Asthma"],
  // Events
  events: [
    {
      id: '1',
      type: 'status' as const,
      timestamp: '2024-02-16T11:45:15Z', // 5 minutes ago
      title: 'Entered Sector 7',
      description: 'Soldier moved into new patrol zone'
    },
    {
      id: '2',
      type: 'agent' as const,
      timestamp: '2024-02-16T11:12:15Z', // 15 minutes ago
      title: 'Alpha Agent Administered',
      description: 'Standard dose delivered successfully'
    },
    {
      id: '3',
      type: 'alert' as const,
      timestamp: '2024-02-15T11:14:54Z', // 30 minutes ago
      title: 'Elevated Heart Rate',
      description: 'BPM increased to 95, monitoring situation'
    },
    {
      id: '4',
      type: 'status' as const,
      timestamp: '2024-02-14T09:42:13Z', // 45 minutes ago
      title: 'Mission Started',
      description: 'Deployed to Stanford campus area'
    },
    {
      id: '5',
      type: 'status' as const,
      timestamp: '2024-02-14T09:42:13Z', // 45 minutes ago
      title: 'Mission Started',
      description: 'Deployed to Stanford campus area'
    },
    {
      id: '6',
      type: 'status' as const,
      timestamp: '2024-02-14T09:42:13Z', // 45 minutes ago
      title: 'Mission Started',
      description: 'Deployed to Stanford campus area'
    }
  ]
};

export default function CommandCenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);
  return (
    <>
      <PageIllustration multiple />
      <section>
        <div className="px-16">
          {/* Hero content */}
          <div className="py-12 md:py-16">
            {/* Section header */}
            <div className="pb-6 text-center">
              <h1 data-aos="fade-up" className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl">
                Aegis Command Center
              </h1>
            </div>
            {/* Command center content */}
            <div className="space-y-8">
              <div className="flex gap-8">
                <div className="flex-1 min-w-0">
                  <MapComponent />
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <SoldierTimeline 
                      events={mockSoldier.events} 
                      soldierId={mockSoldier.codeName}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <ReadStats soldier={mockSoldier} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
