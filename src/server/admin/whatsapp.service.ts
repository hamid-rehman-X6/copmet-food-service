import { errors } from "@/server/api/errors";
import {
  createWhatsappNumber,
  deleteWhatsappNumber,
  listActiveWhatsappNumbers,
  listWhatsappNumbers,
  updateWhatsappNumber,
} from "@/server/admin/whatsapp.repository";
import type { CreateWhatsappNumberInput, UpdateWhatsappNumberInput } from "@/schemas/admin.schemas";
import type { AdminWhatsappNumber } from "@/types/admin.types";

export async function listWhatsappNumbersService(): Promise<AdminWhatsappNumber[]> {
  return listWhatsappNumbers();
}

export async function listActiveWhatsappNumbersService(): Promise<AdminWhatsappNumber[]> {
  return listActiveWhatsappNumbers();
}

export async function createWhatsappNumberService(input: CreateWhatsappNumberInput): Promise<AdminWhatsappNumber> {
  return createWhatsappNumber({
    label: input.label?.trim() || null,
    phone: input.phone,
    isActive: input.isActive ?? true,
  });
}

export async function updateWhatsappNumberService(
  id: string,
  input: UpdateWhatsappNumberInput,
): Promise<AdminWhatsappNumber> {
  const updated = await updateWhatsappNumber(id, {
    label: input.label === undefined ? undefined : input.label.trim() || null,
    phone: input.phone,
    isActive: input.isActive,
  });

  if (!updated) {
    throw errors.notFound("That WhatsApp number could not be found.");
  }

  return updated;
}

export async function deleteWhatsappNumberService(id: string): Promise<void> {
  const deleted = await deleteWhatsappNumber(id);

  if (!deleted) {
    throw errors.notFound("That WhatsApp number could not be found.");
  }
}
