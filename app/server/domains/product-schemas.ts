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
