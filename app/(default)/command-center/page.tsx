"use client";

import { useEffect, useState } from "react";
import PageIllustration from "@/components/page-illustration";
import MapComponent from "./map";
import SoldierTimeline from "@/components/soldier-timeline";
import ReadStats from "@/components/read-stats";
import { createClient } from "@/utils/supabase/client";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useSelectedSoldier } from "@/contexts/SelectedSoldierContext";

// Soldier type definition
export interface Soldier {
  id: string;
  name: string;
  codeName: string;
  rank: string;
  unit: string;
  heartRate: number;
  lastPing: Date;
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
  events: Array<{
    id: string;
    type: 'status' | 'agent' | 'alert';
    timestamp: string;
    title: string;
    description: string;
  }>;
}

export default function CommandCenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [realSoldiers, setRealSoldiers] = useState<Soldier[]>([]);
  const { isDemoMode, setIsDemoMode } = useDemoMode();
  const { selectedSoldier } = useSelectedSoldier();
  const supabase = createClient();

  // Poll for location updates
  useEffect(() => {
    if (isDemoMode) return; // Don't poll in demo mode

    const pollSoldiers = async () => {
      try {
        // Fetch all soldiers from Supabase
        const { data: soldiersData, error } = await supabase
          .from('soldiers')
          .select('*');

        if (error) throw error;

        if (soldiersData && soldiersData.length > 0) {
          setHasLocation(true);
          
          // Transform the data to match the Soldier interface
          const transformedSoldiers = soldiersData.map(soldier => ({
            id: soldier.id,
            name: soldier.name,
            codeName: soldier.code_name,
            rank: soldier.rank,
            unit: soldier.unit,
            heartRate: parseInt(soldier.heart_rate),
            lastPing: new Date(soldier.last_ping),
            coordinates: {
              lat: parseFloat(soldier.latitude),
              lng: parseFloat(soldier.longitude)
            },
            ppgWaveform: soldier.ppg_waveform,
            weight: soldier.weight,
            height: soldier.height,
            bloodType: soldier.blood_type,
            allergies: soldier.allergies,
            medications: soldier.medications,
            preExistingConditions: soldier.pre_existing_conditions,
            events: soldier.events
          }));

          setRealSoldiers(transformedSoldiers);
        }
      } catch (error) {
        // Only log non-404 errors
        if (error instanceof Error && !error.message.includes('404')) {
          console.error('Error polling location:', error);
        }
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollSoldiers, 5000);
    pollSoldiers(); // Initial poll

    return () => clearInterval(interval);
  }, [isDemoMode, supabase]);

  // Check authentication and force demo mode for unauthenticated users
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      // Force demo mode on for unauthenticated users
      if (!isAuth) {
        setIsDemoMode(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      // Force demo mode on for unauthenticated users
      if (!isAuth) {
        setIsDemoMode(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, setIsDemoMode]);

  // Prevent turning off demo mode when not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isDemoMode) {
      setIsDemoMode(true);
    }
  }, [isAuthenticated, isDemoMode, setIsDemoMode]);

  // Determine which soldier data to use
  const soldierData = isDemoMode ? (selectedSoldier || null) : (realSoldiers.find(s => s.id === selectedSoldier?.id) || null);

  return (
    <>
      <PageIllustration multiple />
      <section>
        <div className="px-16">
          <div className="py-12 md:py-16">
            <div className="pb-6 text-center">
              <h1 data-aos="fade-up" className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl">
                Aegis Command Center
              </h1>
            </div>
            
            {/* Command center content */}
            {isDemoMode || hasLocation ? (
              <div className="space-y-8">
                <div className="flex gap-8">
                  <div className="flex-1 min-w-0">
                    <MapComponent realSoldiers={isDemoMode ? [] : realSoldiers} />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <SoldierTimeline 
                        events={soldierData?.events || []} 
                        soldierId={soldierData?.codeName || ''}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  {!selectedSoldier ? (
                    <div className="w-full p-6 rounded-xl bg-gray-950/50 border border-indigo-800/20">
                      <p className="text-center text-gray-400">
                        Click on a soldier dot to view their details
                      </p>
                    </div>
                  ) : (
                    soldierData && <ReadStats soldier={soldierData} />
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
