/** Turns Firebase errors into plain-language messages for admin screens. */
export function friendlyError(err: unknown): string {
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: unknown }).code) : '';
  const message = err instanceof Error ? err.message : String(err);
  if (code.includes('permission-denied') || /insufficient permissions/i.test(message)) {
    return "This account doesn't have admin access for this Masjid yet. Ask the app owner to grant it, then try again.";
  }
  if (code.includes('unavailable') || /network/i.test(message)) {
    return "Couldn't reach the server. Check your internet connection and try again.";
  }
  return message;
}
