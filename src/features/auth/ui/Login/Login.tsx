import { useAppSelector } from '@/common/hooks'
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

const validationRules = {
  email: {
    required: 'Email is required',
    pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Incorrect email address' },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 4, message: 'Password length is min 4' },
  },
}

type LoginInputs = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
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
  })

  const submitHandler = (data: LoginInputs) => {
    console.log('data: ', data)
    reset()
  }

  // console.log('errors: ', errors)

  const theme = getTheme(themeMode)

  return (
    <Grid
      container
      sx={{ justifyContent: 'center' }}
    >
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
              rules={validationRules.email}
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
              rules={validationRules.password}
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
                  render={({ field: { value, ...rest } }) => (
                    <Checkbox
                      {...rest}
                      checked={value}
                    />
                  )}
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
