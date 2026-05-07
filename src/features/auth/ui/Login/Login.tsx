import { useAppDispatch, useAppSelector } from '@/common/hooks'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import { selectThemeMode } from '@/app/model/app-slice'
import { getTheme } from '@/common/theme/theme'
import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginInputs, loginSchema } from '@/features/auth/model/schemas'
import { loginTC, meTC } from '@/features/auth/model/slices/auth-slice'

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<LoginInputs>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginSchema),
  })

  const submitHandler = (data: LoginInputs) => {
    dispatch(loginTC(data))
      .unwrap()
      .then(() => dispatch(meTC()))
    reset()
  }

  return (
    <Grid container sx={{ justifyContent: 'center' }}>
      <FormControl component="fieldset">
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: '5px' }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(submitHandler)}>
          <FormGroup>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={'email'}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    margin="normal"
                    autoComplete="current-password"
                  />
                )
              }}
            />

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} />}
                />
              }
            />
            <Button
              sx={{ maxWidth: '80%', width: '100%', alignSelf: 'center', mt: '30px' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
