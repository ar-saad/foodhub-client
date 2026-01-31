"use server";

import { partnerService } from "@/services/partner.service";

export async function createPartnerProfile(data: {
  name: string;
  address: string;
  description: string;
  logo: string;
}) {
  return await partnerService.createPartnerProfile(data);
}
