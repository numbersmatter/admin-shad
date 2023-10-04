import { z } from "zod";

export const EditProjectSchema = z.object({
  title: z.string().min(3, "Project Title must be atleast 3 characters long."),
  notes: z.string(),
  invoiceAmount: z.number().min(0, "Invoice Amount must be a positive number."),
  _action: z.string().default("updateBasic"),
  testText: z.string(),
});

export const NewTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  notes: z.string(),
  taskPoints: z
    .enum(["0", "1", "2", "3", "5", "8", "13"], {
      required_error: " Please select a task point value between 0 and 13",
      invalid_type_error: " Please select a task point value between 0 and 13",
      description: "Task point value",
    })
    .default("0"),
  projectId: z.string(),
  projectTitle: z.string(),
  storeId: z.string(),
});

export const ToggleTaskSchema = z.object({
  taskId: z.string(),
  _action: z.string().default("toggleTaskComplete"),
  completed: z.enum(["true", "false"]),
});
