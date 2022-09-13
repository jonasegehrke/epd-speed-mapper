import * as msal from "@azure/msal-browser";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_TOKEN,
    authority:
      "https://carbonb2ctest.b2clogin.com/carbonb2ctest.onmicrosoft.com/b2c_1_signupsignin",
        redirectUri: "http://localhost:5173/auth",
    knownAuthorities: ["https://carbonb2ctest.b2clogin.com"],
  },
  cache: {
    cacheLocation: "localStorage", 
    storeAuthStateInCookie: false 
  }
};


export const tokenRequest = {
    scopes: ["https://carbonb2ctest.onmicrosoft.com/a35fb88b-d5cc-4acd-87f7-6f5d654aede4/access_as_user"],
    loginHint: ""
  };
 
