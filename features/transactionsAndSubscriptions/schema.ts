import z from "zod";

export type TransactionActionState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    price?: string[];
    category?: string[];
    mode?: string[];
    date?: string[];
  };
  fields?: {
    name?: string;
    price?: string;
    category?: string;
    mode?: string;
    date?: string;
  };
};
export const PAYMENT_MODES = ["select a payment mode","cash", "upi"] as const;
export const EXPENSE_CATEGORIES = ["select a category","food", "shopping"] as const;

export const CreateTransactionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  price: z.preprocess(
    (val) => (val == "" || val == undefined ? undefined : Number(val)),
    z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Price is Required"
            : "Please enter valid price",
      })
      .positive("Price must be greater than 0")
      .multipleOf(0.01, "Maximum 2 decimal places allowed"),
  ),
  category: z.enum(EXPENSE_CATEGORIES, {
    error: "Please select a category",
  }),
  mode: z.enum(PAYMENT_MODES, { error: "Please select a payment mode" }),
  date: z.preprocess(
    (val) => (val == "" || val == undefined || val == null ? undefined : new Date(String(val))),
    z.date({
      error: (issue) =>
        issue.input === undefined
          ? "Date is required"
          : "Please enter a valid date",
    }),
  ),
});
