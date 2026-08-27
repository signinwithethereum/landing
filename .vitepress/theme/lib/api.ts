/* The client side of the contact/newsletter service in `api/`. The base URL is
 * baked in at build time; `VITE_SIWE_API_URL=http://localhost:8787 pnpm dev`
 * points a dev site at a local API. */

const API_BASE = (
  (import.meta.env.VITE_SIWE_API_URL as string | undefined) || 'https://api.siwe.xyz'
).replace(/\/+$/, '')

export type ApiResult = { ok: true } | { ok: false; error: string }

export async function postJson(
  path: string,
  body: Record<string, unknown>
): Promise<ApiResult> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (response.ok) return { ok: true }

    const payload = await response.json().catch(() => null)
    return {
      ok: false,
      error:
        (payload && typeof payload.error === 'string' && payload.error) ||
        `Something went wrong (${response.status}). Please try again.`
    }
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' }
  }
}
