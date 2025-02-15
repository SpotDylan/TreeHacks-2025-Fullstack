'use client'

import { useState } from 'react'

interface SoldierInfo {
  name: string
  codeName: string
  heartRate: number
  lastPing: Date
  coordinates: {
    lat: number
    lng: number
  }
}

export default function Sidebar({ soldier }: { soldier: SoldierInfo }) {
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
    <div className="h-full w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="space-y-6">
        {/* Soldier Info Section */}
        <div className="rounded-xl bg-gray-800/50 p-4">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Soldier Information
          </h2>
          <div className="space-y-2 text-indigo-200/65">
            <p>Name: {soldier.name}</p>
            <p>Code Name: {soldier.codeName}</p>
          </div>
        </div>

        {/* Vitals Section */}
        <div className="rounded-xl bg-gray-800/50 p-4">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Vitals
          </h2>
          <div className="space-y-2 text-indigo-200/65">
            <p>Heart Rate: {soldier.heartRate} BPM</p>
            <p>Last Ping: {soldier.lastPing.toLocaleString()}</p>
            <p>
              Location: {soldier.coordinates.lat.toFixed(6)},
              {soldier.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Agent Controls Section */}
        <div className="rounded-xl bg-gray-800/50 p-4">
          <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-2 font-nacelle text-xl font-semibold text-transparent">
            Agent Controls
          </h2>
          <div className="grid gap-3">
            <button
              onClick={() => handleAdministerAgent('Alpha')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-white transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
            >
              Administer Alpha
            </button>
            <button
              onClick={() => handleAdministerAgent('Beta')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-white transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
            >
              Administer Beta
            </button>
            <button
              onClick={() => handleAdministerAgent('Gamma')}
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-white transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
            >
              Administer Gamma
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
