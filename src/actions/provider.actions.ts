"use server";

import { providerService } from "@/services/provider.service";

export async function getAllProviders(search: string) {
  return await providerService.getAll(search);
}

export async function getProvider(providerId: string) {
  return await providerService.getById(providerId);
}

export async function createPartnerProfile(data: {
  name: string;
  address: string;
  description: string;
  logo: string;
}) {
  return await providerService.create(data);
}
