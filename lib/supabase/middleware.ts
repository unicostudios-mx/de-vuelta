import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes an expired session and writes updated cookies to the response.
  // Do not add logic between createServerClient and getUser() — it breaks
  // session refresh reliability.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  // /perdidos es público; solo el formulario de avistamiento exige sesión.
  const isProtectedRoute =
    pathname.startsWith("/mascotas") ||
    pathname.startsWith("/reportes") ||
    (pathname.startsWith("/perdidos") && pathname.endsWith("/avistamiento"));

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.search = "";
    if (next?.startsWith("/") && !next.startsWith("//")) {
      url.pathname = next;
    } else {
      url.pathname = "/mascotas";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
