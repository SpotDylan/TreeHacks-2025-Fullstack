"use client";

import { useState, Fragment } from "react";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { generatePredefinedEvents, type Event } from "./event-schema";

const events = generatePredefinedEvents();

const getSeverityColor = (severity: Event["severity"]) => {
  switch (severity) {
    case "high":
      return "bg-red-500/10 text-red-200";
    case "medium":
      return "bg-yellow-500/10 text-yellow-200";
    case "low":
      return "bg-green-500/10 text-green-200";
    default:
      return "bg-indigo-500/10 text-indigo-200";
  }
};

export default function EventCarousel() {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <div className="w-full py-8">
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="relative">
          {/* Navigation arrows */}
          <button 
            onClick={() => setSelectedTab(prev => prev > 0 ? prev - 1 : events.length - 1)}
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800/50 p-2 text-gray-200 hover:bg-gray-800 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => setSelectedTab(prev => prev < events.length - 1 ? prev + 1 : 0)}
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-800/50 p-2 text-gray-200 hover:bg-gray-800 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Tabs content */}
          <TabPanels>
            {events.map((event, idx) => (
              <Transition
                key={event.id}
                as={Fragment}
                show={selectedTab === idx}
                enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-500"
                enterFrom="opacity-0 translate-x-8"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-300"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-8"
              >
                <TabPanel className="focus:outline-none">
                  <div className="overflow-hidden rounded-xl bg-gray-800/30 backdrop-blur-sm">
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="font-mono text-sm text-gray-400">
                          {event.timestamp}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)} Priority
                        </span>
                      </div>
                      <h3 className="mb-3 font-nacelle text-2xl font-semibold text-gray-200">
                        {event.title}
                      </h3>
                      <p className="text-lg text-indigo-200/65">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </TabPanel>
              </Transition>
            ))}
          </TabPanels>

          {/* Dot indicators */}
          <div className="mt-4 flex justify-center gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTab(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  selectedTab === idx
                    ? "bg-indigo-500 w-4"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </TabGroup>
    </div>
  );
}
