"use server";

import { providerService } from "@/services/provider.service";

export async function createPartnerProfile(data: {
  name: string;
  address: string;
  description: string;
  logo: string;
}) {
  return await providerService.createPartnerProfile(data);
}
