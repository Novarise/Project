import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from './auth/[...nextauth]/options';

export async function GET(request: Request) {
  // Get the server session with the provided authentication options
  const session = await getServerSession(authOptions);

  // If there is no session, return an unauthorized error
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
    });
  }

  // Log the session for debugging purposes
  console.log('GET API', session);

  // Return a response indicating whether the session is authenticated
  return NextResponse.json({ authenticated: !!session });
}
