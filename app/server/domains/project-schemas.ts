import { z } from "zod";

export const EditProjectSchema = z.object({
  title: z.string().min(3, "Project Title must be atleast 3 characters long."),
  notes: z.string(),
  invoiceAmount: z.number().min(0, "Invoice Amount must be a positive number."),
  _action: z.string().default("updateBasic"),
  testText: z.string(),
});
