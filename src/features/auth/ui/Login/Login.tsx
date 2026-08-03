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
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginInputs, loginSchema } from '@/features/auth/model/schemas'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { ResultCode } from '@/common/enums'
import { useLazyGetCaptchaQuery } from '@/features/captcha/api/captchaApi'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()

  const [triggerGetCaptcha, { data: captchaData, isLoading: isCaptchaLoading }] = useLazyGetCaptchaQuery()

  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  // Предотвращает потерю фокуса поля ввода при клике на иконку
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
  }

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    control,
  } = useForm<LoginInputs>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      captcha: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const submitHandler = (formData: LoginInputs) => {
    login(formData)
      .unwrap()
      .then((responseData) => {
        if (responseData.resultCode === ResultCode.Success) {
          // ! в responseData ещё userId
          reset()
        } else if (responseData.resultCode === ResultCode.CaptchaError) {
          setError('captcha', {
            type: 'manual',
            message: responseData.messages[0],
          })
          triggerGetCaptcha()
        }
      })
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
          {captchaData?.url && (
            <div>
              {isCaptchaLoading ? <span>captcha is loading... </span> : <img src={captchaData.url} alt="Captcha" />}
            </div>
          )}
        </FormLabel>
        <form onSubmit={handleSubmit(submitHandler)}>
          <FormGroup>
            {captchaData?.url && (
              <Controller
                name="captcha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="Captcha"
                    error={!!errors.captcha}
                    helperText={errors.captcha?.message}
                    margin="normal"
                  />
                )}
              />
            )}
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
              render={({ field }) => (
                <TextField
                  {...field}
                  // type="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            tabIndex={-1}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
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
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Logging in...' : 'Login'}
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
