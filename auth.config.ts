import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ["/myAsset", "/buySell"];

      // Check if the user is trying to access a protected route
      const isOnPortectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isOnPortectedRoute) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/myAsset", nextUrl));
      }
      return true; // Allow access to public or non-protected pages
    },
  },
  providers: [],
} satisfies NextAuthConfig;
