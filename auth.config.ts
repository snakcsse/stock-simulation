import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ["/asset", "/buy-sell", "/transactions"];

      // Check if the user is trying to access a protected route
      const isOnProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/buy-sell", nextUrl));
      }
      return true; // Allow access to public or non-protected pages
    },
    // async session({ session, user }) {
    //   session.user = user; // Example: adding user ID to session
    //   return session;
    // },
  },
  providers: [],
} satisfies NextAuthConfig;
