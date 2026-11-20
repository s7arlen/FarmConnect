/**
 * FarmConnect Mobile API Client
 * Connects native mobile app with Express REST API service
 */

import { Platform } from "react-native";

// On Android Emulator, localhost is 10.0.2.2. On physical device or iOS, use machine LAN IP or localhost.
const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000/api/v1"
    : "http://localhost:5000/api/v1";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  token?: string | null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    return json;
  } catch (err: any) {
    // Fail gracefully for demonstration offline resilience
    return {
      success: false,
      error: err.name === "AbortError" ? "Network timeout" : "Backend offline",
    };
  }
}
