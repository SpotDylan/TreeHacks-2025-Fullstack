import { NextRequest, NextResponse } from 'next/server';

interface LocationUpdate {
  latitude: number;
  longitude: number;
}

const API_KEY = process.env.LOCATION_API_KEY;
let lastLocation: LocationUpdate | null = null;

export async function POST(req: NextRequest) {
  try {
    // Check API key from request header
    const authHeader = req.headers.get('authorization');
    const providedApiKey = authHeader?.replace('Bearer ', '');

    if (!API_KEY || providedApiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate the request body
    if (!body || typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid location data. Latitude and longitude must be numbers.' },
        { status: 400 }
      );
    }

    const { latitude, longitude }: LocationUpdate = body;

    // Store the location update
    lastLocation = { latitude, longitude };

    // Log the received coordinates
    console.log('Received location:', { latitude, longitude });

    return NextResponse.json(
      { 
        message: 'Location updated successfully',
        data: { latitude, longitude }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!lastLocation) {
    return NextResponse.json(
      { message: 'No location data available' },
      { status: 404 }
    );
  }

  return NextResponse.json(lastLocation);
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
