import { z } from "zod";

export const UpdateReviewStatusSchema = z.object({
  _action: z.literal("updateReviewStatus"),
  proposalId: z.string(),
  reviewStatus: z.enum(["review", "hold", "accepted", "declined"]),
});
