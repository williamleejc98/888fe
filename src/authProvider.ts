import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";
import { decode as jwtDecode } from "jsonwebtoken";

interface MyJwtPayload {
  username: string;
  // ... any other fields you expect in the payload
}

export const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    try {
      const response = await fetch('https://api.play888king.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in a cookie
        nookies.set(null, "jwt", data.access_token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });

        // Assuming data.user contains user details
        nookies.set(null, "auth", JSON.stringify(data.user), {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });

        // Refresh the window
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        return {
          success: true,
          redirectTo: "/",
        };
      } else {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: data.message || "Invalid username or password",
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          name: "NetworkError",
          message: "Failed to connect to the server",
        },
      };
    }
  },

  logout: async () => {
    nookies.destroy(null, "jwt");
    nookies.destroy(null, "auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async (ctx: any) => {
    const cookies = nookies.get(ctx);
    if (cookies["jwt"] && cookies["auth"]) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },

  getIdentity: async () => {
    const jwt = nookies.get()["jwt"];
    if (jwt) {
      const decodedToken = jwtDecode(jwt) as MyJwtPayload;
      const username = decodedToken?.username;

      if (username) {
        // Fetch credit balance
        const response = await fetch(`https://api.play888king.com/agents/${username}`);
        const data = await response.json();

        // Assuming data.balance contains the credit balance
        const creditBalance = data.balance;

        return {
          ...decodedToken,
          creditBalance: creditBalance,
        };
      }
    }
    return null;
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
