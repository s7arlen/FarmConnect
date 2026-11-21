/**
 * Neon Auth (Managed Better Auth) Integration for FarmConnect.
 */

export const NEON_AUTH_CONFIG = {
  baseUrl: process.env.NEON_AUTH_BASE_URL || "",
  jwksUrl: process.env.NEON_AUTH_JWKS_URL || "",
};

/**
 * Fetch the public JWKS keys from Neon Auth.
 */
export async function getNeonAuthJWKS() {
  if (!NEON_AUTH_CONFIG.jwksUrl) {
    throw new Error("NEON_AUTH_JWKS_URL is not configured.");
  }
  const response = await fetch(NEON_AUTH_CONFIG.jwksUrl, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS from Neon Auth: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Verify Neon Auth endpoint health.
 */
export async function checkNeonAuthHealth(): Promise<boolean> {
  try {
    const jwks = await getNeonAuthJWKS();
    return Boolean(jwks && Array.isArray(jwks.keys) && jwks.keys.length > 0);
  } catch (error) {
    console.error("Neon Auth health check failed:", error);
    return false;
  }
}
