import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const foodSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  caloriesPer100g: z.coerce.number().min(0).max(10000),
  proteinPer100g: z.coerce.number().min(0).max(1000),
  carbsPer100g: z.coerce.number().min(0).max(1000),
  fatPer100g: z.coerce.number().min(0).max(1000),
});

export const entrySchema = z.object({
  foodId: z.coerce.number().min(1, "Please select a food"),
  grams: z.coerce.number().min(1, "Grams must be at least 1").max(10000),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type FoodFormData = z.infer<typeof foodSchema>;
export type EntryFormData = z.infer<typeof entrySchema>;

