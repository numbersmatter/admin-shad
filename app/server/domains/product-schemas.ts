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

export const OptionNameSchema = z.object({
  name: z
    .string()
    .min(3, "Option Name must be at least 3 characters long.")
    .max(100),
});

export const OptionChoiceSchema = z.object({
  name: z
    .string()
    .min(3, "Choice Name must be at least 3 characters long.")
    .max(100),
  description: z.string().max(100),
  priceRange: z.string(),
  choiceId: z.string().min(3).default("addChoice"),
});

export const MoveOptionChoiceSchema = z.object({
  _action: z.string().default("moveChoice"),
  choiceId: z.string(),
  direction: z.enum(["up", "down"]),
});

export const DeleteOptionChoiceSchema = z.object({
  _action: z.string().default("deleteOptionChoice"),
  choiceId: z.string(),
});

const customEnumErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Please select a valid option." };
    default:
      return { message: ctx.defaultError };
  }
};

export const AddFormFieldSchema = z.object({
  fieldLabel: z.string().min(3).max(100),
  fieldType: z
    .enum(["textField", "textArea", "select", "emailField", "imageUpload"], {
      errorMap: customEnumErrorMap,
    })
    .default("textField"),
});
