import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email('Incorrect email address'),
  password: z.string().min(4, 'Password length is min 4'),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
