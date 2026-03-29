import { NextResponse } from "next/server";

/**
 * Dummy route to handle next-auth session requests
 * This project uses Supabase, not next-auth, but some browser extensions
 * or cached code might try to access this endpoint.
 * 
 * This route prevents the error from appearing in the console.
 */
export async function GET() {
  // Return null session to match next-auth's expected response format
  // This prevents errors from browser extensions or cached code
  return NextResponse.json(
    { 
      user: null,
      expires: null 
    },
    { status: 200 }
  );
}
