import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  // todo : remove this before push the productions
  console.log(token);
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dasbord", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/about/:path*", "/sign-in", "/", "/verify/:path*"],
};
