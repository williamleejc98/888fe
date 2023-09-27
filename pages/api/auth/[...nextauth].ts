import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // !!! Should be stored in .env file.
    Auth0Provider({
      clientId: `AbQeb6rjTpNOJR9vtjkyfkWW5UF3WrpY`,
      clientSecret: `77386zmwTiKbN_bHoqRb4RUpwT7d4O81ouMtdmyiX4MfjYdsoJT5J1f5ty0KEtku`,
      issuer: `https://dev-b5eyrhx8ed6hts4g.us.auth0.com`,
    }),
  ],
  secret: `UItTuD1HcGXIj8ZfHUswhYdNd40Lc325R8VlxQPUoR0=`,
};
export default NextAuth(authOptions);
