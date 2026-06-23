import { JwtPayload, jwtDecode } from "jwt-decode";

import { ROLES } from "@/src/enums/Roles";

export type AuthTokenPayload = JwtPayload & {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type LoginApiResponse = {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken?: string;
  };
};

export const decodeAccessToken = (
  accessToken?: string | null
): AuthTokenPayload | null => {
  if (!accessToken) {
    return null;
  }

  try {
    return jwtDecode<AuthTokenPayload>(accessToken);
  } catch (error) {
    console.error("Failed to decode access token:", error);
    return null;
  }
};

export const getAccessTokenFromBrowser = () => {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1] ?? null
  );
};

export const getCurrentUserFromBrowserToken = () =>
  decodeAccessToken(getAccessTokenFromBrowser());

export const isAdminRole = (role?: string | null) => role === ROLES.ADMIN;

export const getDashboardRouteByRole = (role?: string | null) =>
  isAdminRole(role) ? "/admin-dashboard" : "/dashboard";

const isSafeInternalPath = (redirectPath?: string | null) =>
  Boolean(
    redirectPath &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
  );

export const getPostLoginRoute = (
  role?: string | null,
  redirectPath?: string | null
) => {
  if (isAdminRole(role)) {
    return "/admin-dashboard";
  }

  return isSafeInternalPath(redirectPath) ? redirectPath! : "/dashboard";
};

export const loginWithCredentials = async (
  email: string,
  password: string
) => {
  const response = await fetch("/api/proxy/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const payload: LoginApiResponse = await response.json();

  if (!response.ok || !payload.success || !payload.data?.accessToken) {
    throw new Error(payload.message || "Invalid email or password.");
  }

  return payload.data;
};
