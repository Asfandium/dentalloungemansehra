import { z } from 'zod';

export const genderOptions = ['Male', 'Female', 'Prefer not to say'] as const;
export type GenderOption = typeof genderOptions[number];

export const appointmentFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Full name is required (minimum 2 characters)' }),
  gender: z.enum(genderOptions, { required_error: 'Please select a gender option' }),
  appointmentDate: z.string().min(1, { message: 'Preferred appointment date is required' }),
  contactNumber: z
    .string()
    .trim()
    .min(7, { message: 'Valid contact number is required' })
    .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, { message: 'Please enter a valid phone number format' }),
  email: z.string().trim().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  message: z.string().trim().optional(),
  services: z
    .array(z.string())
    .min(1, { message: 'Please select at least one dental service' })
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export interface AppointmentApiPayload {
  name: string;
  gender: GenderOption;
  appointmentDate: string;
  contactNumber: string;
  email?: string;
  message?: string;
  services: string[];
}
