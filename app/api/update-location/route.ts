import { NextRequest, NextResponse } from 'next/server';

interface LocationUpdate {
  latitude: number;
  longitude: number;
}

const API_KEY = process.env.LOCATION_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // Check API key from request header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const providedApiKey = authHeader.replace('Bearer ', '');
    if (!API_KEY || providedApiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: LocationUpdate;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    // Validate the location data
    if (!body || typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid location data. Latitude and longitude must be numbers.' },
        { status: 400 }
      );
    }

    // Validate latitude and longitude ranges
    if (body.latitude < -90 || body.latitude > 90 || body.longitude < -180 || body.longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' },
        { status: 400 }
      );
    }

    const { latitude, longitude } = body;

    // Here you would typically store the location in a database
    // For now, we'll just log it
    console.log('Location updated:', { latitude, longitude });

    return NextResponse.json(
      { 
        message: 'Location updated successfully',
        data: { latitude, longitude }
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In a real application, you would fetch the latest location from a database
  return NextResponse.json(
    { error: 'Not implemented' },
    { status: 501 }
  );
}
