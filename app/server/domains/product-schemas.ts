import { z } from "zod";

export const ProductBasicsSchema = z.object({
  name: z.string().min(5, "Product Name must be at least 5 characters long."),
  priceRange: z.string(),
  description: z.string(),
  pricing: z.string(),
  ordering: z
    .number({
      invalid_type_error: "This must be a non negative number.",
    })
    .nonnegative(),
});

export const MoveOptionSchema = z.object({
  _action: z.string().default("moveOption"),
  optionId: z.string(),
  direction: z.enum(["up", "down"]),
});

export const EditDetailBasicSchema = z.object({
  name: z
    .string()
    .min(3, "Detail Name must be at least 3 characters long.")
    .max(100),
  type: z.enum(["bullet", "paragraph"]).default("bullet"),
  _action: z.string().default("updateBasic"),
  id: z.string(),
});

export const AddDetailSchema = z.object({
  name: z
    .string()
    .min(3, "Detail Name must be at least 3 characters long.")
    .max(100),
  type: z.enum(["bullet", "paragraph"]).default("bullet"),
});

export const AddOptionSchema = z.object({
  name: z
    .string()
    .min(3, "Option Name must be at least 3 characters long.")
    .max(100),
});
