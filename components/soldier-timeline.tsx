'use client'

import { useState, useEffect } from 'react'

interface TimelineEvent {
  id: string
  type: 'status' | 'alert' | 'agent'
  timestamp: string
  title: string
  description: string
}

export default function SoldierTimeline({ 
  events, 
  soldierId = "Unknown"
}: { 
  events: TimelineEvent[]
  soldierId?: string 
}) {
  const [startIndex, setStartIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const itemsPerPage = 4

  const navigateBack = () => {
    if (startIndex >= itemsPerPage) {
      setStartIndex(prev => prev - itemsPerPage)
    }
  }

  const navigateForward = () => {
    if (startIndex + itemsPerPage < events.length) {
      setStartIndex(prev => prev + itemsPerPage)
    }
  }
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  const showMoreEvents = () => {
    if (startIndex + itemsPerPage < events.length) {
      setStartIndex(prev => prev + itemsPerPage)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="pb-8 md:pb-12">
          {/* Title and Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-nacelle text-2xl font-semibold text-gray-200">Activity Log</h2>
              <p className="text-sm text-gray-500">ID: {soldierId}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={navigateBack}
                disabled={startIndex === 0}
                className={`rounded-lg p-2 ${
                  startIndex === 0 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-200 hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={navigateForward}
                disabled={startIndex + itemsPerPage >= events.length}
                className={`rounded-lg p-2 ${
                  startIndex + itemsPerPage >= events.length 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-200 hover:bg-gray-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
          {/* Items */}
          <div
            className="-my-2 mx-auto w-[16rem] min-h-[28rem] max-h-[28rem]"
            data-aos-id-timeline=""
          >
            {sortedEvents.slice(startIndex, startIndex + itemsPerPage).map((event, index) => (
              <div
                key={event.id}
                className="relative py-4 pl-4 h-[7rem]"
                data-aos="fade-up"
                data-aos-delay={index * 200}
                data-aos-anchor="[data-aos-id-timeline]"
              >
                <div className="pl-1">
                  <div className={`inline-flex bg-clip-text pb-1 text-sm text-transparent ${
                    event.type === 'alert' 
                      ? 'from-red-500 to-red-200' 
                      : event.type === 'agent' 
                      ? 'from-purple-500 to-purple-200' 
                      : 'from-indigo-500 to-indigo-200'
                  } bg-linear-to-r`}>
                    {event.timestamp}
                  </div>
                  <div className="mb-1 flex items-center">
                    {index !== sortedEvents.slice(startIndex, startIndex + itemsPerPage).length - 1 && (
                      <div
                        className="absolute left-0 h-full -translate-x-1/2 translate-y-3 transform self-start bg-gray-800 px-px"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className={`absolute left-0 box-content h-1.5 w-1.5 -translate-x-1/2 transform rounded-full border-2 border-gray-950 ${
                        event.type === 'alert' 
                          ? 'bg-red-500' 
                          : event.type === 'agent' 
                          ? 'bg-purple-500' 
                          : 'bg-indigo-500'
                      }`}
                      aria-hidden="true"
                    />
                    <h4 className="font-nacelle text-base font-semibold text-gray-200">
                      {event.title}
                    </h4>
                  </div>
                  <p className="text-sm text-indigo-200/65">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  )
}
