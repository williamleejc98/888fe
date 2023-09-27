import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { config } from "dotenv";

// Load environment variables from .env.local file
config();

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET!,
};


export default NextAuth(authOptions);