import { NextResponse } from "next/server";

// Pass-through middleware (no auth yet). Ensures routes render normally.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


