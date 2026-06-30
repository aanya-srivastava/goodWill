import { z } from "zod";

const bloodGroupEnum = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

export const bloodDonationSchema = z.object({
  donorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int("Age must be a whole number")
    .min(16, "Donors must be at least 16 years old")
    .max(65, "Donors must be at most 65 years old"),
  gender: z.string().min(1, "Please select a gender"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s-]{10,15}$/, "Enter a valid phone number"),
  bloodGroup: bloodGroupEnum,
  availability: z.string().min(1, "Please select an availability date"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address must be at most 300 characters"),
  recentlyDonated: z.boolean(),
});

export const bloodRequestSchema = z.object({
  patientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  age: z
    .number({ invalid_type_error: "Age is required" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be at most 120"),
  gender: z.string().min(1, "Please select a gender"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s-]{10,15}$/, "Enter a valid phone number"),
  bloodGroup: bloodGroupEnum,
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .int("Amount must be a whole number")
    .min(1, "At least 1 unit is required")
    .max(10, "Maximum 10 units per request"),
  hospital: z
    .string()
    .min(2, "Hospital name is required")
    .max(200, "Hospital name must be at most 200 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address must be at most 300 characters"),
});

export type BloodDonationFormData = z.infer<typeof bloodDonationSchema>;
export type BloodRequestFormData = z.infer<typeof bloodRequestSchema>;
