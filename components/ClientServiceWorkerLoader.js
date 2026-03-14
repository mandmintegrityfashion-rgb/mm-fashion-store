"use client";

import { useServiceWorker } from "@/lib/useServiceWorker";

export default function ClientServiceWorkerLoader() {
  useServiceWorker();
  return null;
}
