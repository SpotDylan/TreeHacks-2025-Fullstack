'use client'

import { useState } from 'react'
import Search from '@/components/search'

interface Event {
  id: string
  type: 'status' | 'agent' | 'alert'
  timestamp: string
  title: string
  description: string
}

interface SoldierInfo {
  name: string
  codeName: string
  rank: string
  unit: string
  heartRate: number
  lastPing: Date
  coordinates: {
    lat: number
    lng: number
  }
  ppgWaveform: number[]
  // Medical Information
  weight: string
  height: string
  bloodType: string
  allergies: string[]
  medications: string[]
  preExistingConditions: string[]
  // Events
  events: Event[]
}

export default function ReadStats({ soldier }: { soldier: SoldierInfo }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAdministerAgent = async (agentType: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement agent administration logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Administering ${agentType}`)
    } catch (error) {
      console.error('Error administering agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full p-6 rounded-xl">
      <div className="grid grid-cols-4 gap-6">
        {/* Basic Info Section */}
        <div className="rounded-xl bg-gray-950/50 p-4 border border-indigo-800/20 animate-fade-in">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-indigo-300),var(--color-indigo-100),var(--color-indigo-400),var(--color-indigo-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Basic Information
          </h2>
          <div className="space-y-2 text-indigo-100/80">
            <p>Name: {soldier.name}</p>
            <p>Rank: {soldier.rank}</p>
            <p>Unit: {soldier.unit}</p>
            <p>Height: {soldier.height}</p>
            <p>Weight: {soldier.weight}</p>
          </div>
        </div>

        {/* Medical Info Section */}
        <div className="rounded-xl bg-gray-950/50 p-4 border border-indigo-800/20 animate-fade-in [animation-delay:200ms]">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-indigo-300),var(--color-indigo-100),var(--color-indigo-400),var(--color-indigo-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Medical Information
          </h2>
          <div className="space-y-2 text-indigo-100/80">
            <p>Blood Type: {soldier.bloodType}</p>
            <p>Allergies: {soldier.allergies.join(', ') || 'None'}</p>
            <p>Medications: {soldier.medications.join(', ') || 'None'}</p>
            <p>Pre-existing Conditions: {soldier.preExistingConditions.join(', ') || 'None'}</p>
          </div>
        </div>

        {/* Vitals Section */}
        <div className="rounded-xl bg-gray-950/50 p-4 border border-indigo-800/20 animate-fade-in [animation-delay:400ms]">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-indigo-200),var(--color-indigo-300),var(--color-indigo-100),var(--color-indigo-400),var(--color-indigo-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Current Status
          </h2>
          <div className="space-y-2 text-indigo-100/80">
            <p>Heart Rate: {soldier.heartRate} BPM</p>
            <p className="text-sm text-indigo-300/60 mb-1">PPG Waveform</p>
            <div className="h-16 w-full">
              <svg className="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                <path
                  d={`M 0,50 ${soldier.ppgWaveform.map((value, index) => 
                    `L ${(index * 200 / (soldier.ppgWaveform.length - 1))},${100 - value * 80}`
                  ).join(' ')}`}
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <p>Last Ping: {soldier.lastPing.toLocaleString()}</p>
            <p>
              Location: {soldier.coordinates.lat.toFixed(6)},
              {soldier.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Agent Controls Section */}
        <div className="rounded-xl bg-gray-950/50 p-4 border border-indigo-800/20 animate-fade-in [animation-delay:600ms]">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Agent Controls
          </h2>
          <div className="space-y-4">
            <Search />
            <div className="grid gap-2">
            <button
              onClick={() => handleAdministerAgent('Alpha')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-2 text-white transition-all hover:from-indigo-700 hover:to-indigo-900 disabled:opacity-50 border border-indigo-500/20"
            >
              Administer Adrenaline
            </button>
            <button
              onClick={() => handleAdministerAgent('Beta')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-2 text-white transition-all hover:from-indigo-700 hover:to-indigo-900 disabled:opacity-50 border border-indigo-500/20"
            >
              Administer Clotting Factor
            </button>
            <button
              onClick={() => handleAdministerAgent('Gamma')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-2 text-white transition-all hover:from-indigo-700 hover:to-indigo-900 disabled:opacity-50 border border-indigo-500/20"
            >
              Administer Morphine
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
