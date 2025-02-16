import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { mockSoldiers } from '@/utils/mockSoldierData';

const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Format mock soldier data into a concise context
    const soldiersContext = mockSoldiers.map(soldier => ({
      id: soldier.id,
      name: soldier.name,
      rank: soldier.rank,
      unit: soldier.unit,
      status: soldier.event,
      location: `${soldier.coordinates.lat.toFixed(4)}, ${soldier.coordinates.lng.toFixed(4)}`,
      heartRate: soldier.heartRate,
      lastPing: new Date(soldier.lastPing).toISOString()
    }));

    // Create system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a military command center AI assistant. Current force status:
${soldiersContext.map(s => 
  `- ${s.rank} ${s.name} (${s.unit}): ${s.status} at ${s.location}, HR: ${s.heartRate}, Last: ${s.lastPing}`
).join('\n')}

Provide concise, focused answers about unit locations and status. Keep responses under 100 words and focus on actionable insights.`
    };

    const response = await mistralClient.chat.complete({
      model: "mistral-tiny",
      messages: [systemMessage, ...messages],
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Mistral API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
