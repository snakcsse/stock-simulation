import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // authentication checks are implemented for the below paths
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
