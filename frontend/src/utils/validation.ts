import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

export const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters").max(50, "Team name must be at most 50 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  maxSize: z.number().min(2, "Team must have at least 2 members").max(10, "Team can have at most 10 members"),
  lookingFor: z.array(z.string()).min(1, "Please specify at least one skill you're looking for"),
  techStack: z.array(z.string()).optional(),
  projectIdea: z.string().max(1000, "Project idea must be at most 1000 characters").optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message must be at most 2000 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
