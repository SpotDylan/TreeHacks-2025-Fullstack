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
interface Soldier {
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
  const [realSoldier, setRealSoldier] = useState<Soldier | null>(null);
  const { isDemoMode } = useDemoMode();
  const { selectedSoldier } = useSelectedSoldier();
  const supabase = createClient();

  // Poll for location updates
  useEffect(() => {
    if (isDemoMode) return; // Don't poll in demo mode

    const pollLocation = async () => {
      try {
        const response = await fetch('/api/update-location');
        if (!response.ok) {
          // If we get a 404, it means no location data yet - this is expected
          if (response.status === 404) {
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setHasLocation(true);
          
          try {
            // Fetch soldier data from Supabase using hardcoded ID
            const { data: soldierData, error } = await supabase
              .from('soldiers')
              .select('*')
              .eq('id', '1234')
              .single();

            if (error) throw error;

            // Update soldier location in Supabase
            await supabase
              .from('soldiers')
              .update({
                coordinates: {
                  lat: data.latitude,
                  lng: data.longitude
                },
                lastPing: new Date().toISOString()
              })
              .eq('id', '1234');

            // Update local state
            setRealSoldier({
              ...soldierData,
              coordinates: {
                lat: data.latitude,
                lng: data.longitude
              },
              lastPing: new Date()
            });
          } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
          }
        }
      } catch (error) {
        // Only log non-404 errors
        if (error instanceof Error && !error.message.includes('404')) {
          console.error('Error polling location:', error);
        }
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(pollLocation, 5000);
    pollLocation(); // Initial poll

    return () => clearInterval(interval);
  }, [isDemoMode, supabase]);

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

  // Determine which soldier data to use
  const soldierData = isDemoMode ? (selectedSoldier || null) : realSoldier;

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
            {isDemoMode || (hasLocation && soldierData) ? (
              <div className="space-y-8">
                <div className="flex gap-8">
                  <div className="flex-1 min-w-0">
                    <MapComponent />
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
                  {isDemoMode && !selectedSoldier ? (
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
            ) : (
              <div className="w-full p-6 rounded-xl bg-gray-950/50 border border-indigo-800/20">
                <p className="text-center text-gray-400">
                  All users are offline
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
