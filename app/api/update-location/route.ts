import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface LocationUpdate {
  uuid: string;
  latitude: number;
  longitude: number;
}

const API_KEY = process.env.LOCATION_API_KEY;

export async function POST(req: NextRequest) {
  console.log('POST request received:', {
    headers: Object.fromEntries(req.headers.entries()),
    url: req.url,
  });

  try {
    const headers = {
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

    // Validate UUID format
    if (!body.uuid) {
      console.log('Missing UUID');
      return NextResponse.json(
        { error: 'Missing UUID' },
        { status: 400, headers }
      );
    }

    // Check if UUID exists in Supabase
    const supabase = await createClient();
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', body.uuid)
      .single();

    if (userError || !existingUser) {
      console.log('Invalid UUID - not found in database:', body.uuid);
      return NextResponse.json(
        { error: 'Invalid UUID' },
        { status: 401, headers }
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

    const { latitude, longitude, uuid } = body;

    // Update location in Supabase (reuse existing client)
    const { error: updateError } = await supabase
      .from('locations')
      .upsert({ 
        id: uuid,
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update location' },
        { status: 500, headers }
      );
    }

    return NextResponse.json(
      { 
        message: 'Location updated successfully',
        data: { uuid, latitude, longitude }
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
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const headers = {
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

    // Extract UUID from query parameters
    const url = new URL(req.url);
    const uuid = url.searchParams.get('uuid');
    
    if (!uuid) {
      return NextResponse.json(
        { error: 'Missing UUID parameter' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if UUID exists in Supabase
    const supabase = await createClient();
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', uuid)
      .single();

    if (userError || !existingUser) {
      return NextResponse.json(
        { error: 'Invalid UUID' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Get location data
    const { data, error } = await supabase
      .from('locations')
      .select('latitude, longitude')
      .eq('id', uuid)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'No location data available' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
