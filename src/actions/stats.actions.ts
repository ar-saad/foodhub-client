"use server";

import { statsService } from "@/services/stats.service";

export async function getPlatformStats() {
  return await statsService.getPlatformStats();
}
