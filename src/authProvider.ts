import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";
import axios from 'axios';



export const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    // Treat the email parameter as a username
  
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
        nookies.set(null, "auth", JSON.stringify(data.user), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
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
    nookies.destroy(null, "auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (ctx: any) => {
    const cookies = nookies.get(ctx);
    if (cookies["auth"]) {
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
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
