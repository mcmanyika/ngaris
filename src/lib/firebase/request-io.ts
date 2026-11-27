import "server-only";

import { io } from "next/cache";

/**
 * Firebase Admin / gRPC clients use Date.now() internally.
 * Call this before Firestore/Auth reads from React Server Components
 * so Cache Components excludes them from prerender.
 */
export async function awaitRequestIo() {
  await io();
}
