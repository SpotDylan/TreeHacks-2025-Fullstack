import { NextRequest, NextResponse } from 'next/server';

interface LocationUpdate {
  latitude: number;
  longitude: number;
}

const API_KEY = process.env.LOCATION_API_KEY;

// Add CORS headers helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  console.log('POST request received:', {
    headers: Object.fromEntries(req.headers.entries()),
    url: req.url,
  });

  try {
    // Add CORS headers to all responses
    const headers = {
      ...corsHeaders(),
      'Content-Type': 'application/json',
    };

    // Check API key from request header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401, headers }
      );
    }

    const providedApiKey = authHeader.replace('Bearer ', '');
    if (!API_KEY || providedApiKey !== API_KEY) {
      console.log('Invalid API key');
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401, headers }
      );
    }

    // Parse and validate request body
    let body: LocationUpdate;
    try {
      const rawBody = await req.text();
      console.log('Raw request body:', rawBody);
      body = JSON.parse(rawBody);
    } catch (e) {
      console.log('Invalid JSON body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400, headers }
      );
    }
    
    // Validate the location data
    if (!body || typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
      console.log('Invalid location data:', body);
      return NextResponse.json(
        { error: 'Invalid location data. Latitude and longitude must be numbers.' },
        { status: 400, headers }
      );
    }

    // Validate latitude and longitude ranges
    if (body.latitude < -90 || body.latitude > 90 || body.longitude < -180 || body.longitude > 180) {
      console.log('Invalid coordinate ranges:', body);
      return NextResponse.json(
        { error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' },
        { status: 400, headers }
      );
    }

    const { latitude, longitude } = body;

    // Here you would typically store the location in a database
    console.log('Location update successful:', { latitude, longitude });

    return NextResponse.json(
      { 
        message: 'Location updated successfully',
        data: { latitude, longitude }
      },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          ...corsHeaders(),
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Not implemented' },
    { 
      status: 501,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json',
      }
    }
  );
}
