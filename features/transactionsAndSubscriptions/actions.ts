"use server";

import { revalidatePath } from "next/cache";
import { CreateTransactionSchema } from "./schema";
import {z} from "zod"
export async function createTransaction(
  previousState: unknown,
  formData: FormData,
) {
  const rawData = {
    name: formData.get("name")?.toString(),
    price: formData.get("price")?.toString(),
    mode: formData.get("mode")?.toString(),
    category: formData.get("category")?.toString(),
    date: formData.get("date")?.toString(),
  };
  const validated = CreateTransactionSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      message: "Error while validating form input",
      errors: z.flattenError(validated.error).fieldErrors,
      fields: {
        name: rawData.name,
        price: rawData.price,
        mode: rawData.mode,
        category: rawData.category,
        date: rawData.date,
      },
    };
  }
  try {
    // db update
    console.log("data: ", validated.data);
  } catch (error) {
    console.log("[CREATE_TRANSACTION_ERROR]:", error);
    return {
      success: false,
      message:
        "Something went wrong while creating the Transaction. Please try again.",
      fields: {
        name: rawData.name,
        price: rawData.price,
        mode: rawData.mode,
        category: rawData.category,
        date: rawData.date,
      },
    };
  }

  revalidatePath("/");

  return {
    success: true,
    message: "Transaction created successfully",
  };
}
