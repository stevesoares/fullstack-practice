import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  // Only guard /app routes (see matcher below)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  const callbackUrl = encodeURIComponent(url.pathname + url.search);
  const signInUrl = new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, url.origin);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/app/:path*"],
};


