import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email({ abort: true, error: 'Incorrect email address' }),
  password: z.string().min(4, 'Password length is min 4'),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),
})

export type LoginInputs = z.infer<typeof loginSchema>
