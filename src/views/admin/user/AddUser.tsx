'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import type { companyObjType } from '../store/AddStore'

export type RoleType = {
  id: number
  roleName: string
}

export type userObjType = {
  id: number
  userTypeName: string
}

export type FormValues = {
  firstName: string
  lastName: string
  userName: string
  userPassword: string
  userEmail: string
  userMobile: string
  userDepartment: string
  userRole: RoleType | null | number
  companyId: companyObjType | null
  isActive: boolean
  userType: userObjType | string
}

const AddUser: React.FC = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [rolelist, setRoleList] = useState([])
  const [allCompanies, setAllCompanies] = useState([])
  const [token, setToken] = useState('')

  // Variable
  // const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP

  // Hooks

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      userPassword: '',
      userEmail: '',
      userMobile: '',
      userDepartment: '',
      userRole: null,
      companyId: null,
      userType: '',
      isActive: true
    }
  })

  useEffect(() => {
    fetchToken()
  }, [])

  const fetchToken = async () => {
    try {
      const response = await fetch('/api/login', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setToken(result.token)
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  useEffect(() => {
    if (token !== '') {
      fetchUserRole()
      fetchAllCompanies()
    }
  }, [token])

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list-user-role`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        setRoleList(data)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchAllCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/company-list`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        setAllCompanies(data)
      } else {
        console.error('Failed to fetch companies:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (typeof data.userType !== 'string') {
        data.userType = data.userType?.userTypeName
      }
      data.isActive = data.isActive === true
      const newUser: any = { ...data }

      newUser.userRole = newUser.userRole?.id
      newUser.companyId = newUser.companyId?.id

      const response = await fetch(`${API_URL}/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      })

      const result = await response.json()

      if (result.status === 200) {
        toast.success('User created successfully')
        reset() // Reset form after successful submission
      } else {
        toast.error('Failed to create User')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    }
  }

  const UserType = [
    {
      id: 1,
      userTypeName: 'Cashier'
    },
    {
      id: 2,
      userTypeName: 'Web Page'
    }
  ]

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* <Grid container spacing={6}> */}
            {/* </Grid> */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='firstName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='First Name*'
                    placeholder='Enter First Name'
                    error={!!errors.firstName}
                    helperText={errors.firstName ? errors.firstName.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='lastName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Last Name*'
                    placeholder='Enter Last Name'
                    error={!!errors.lastName}
                    helperText={errors.lastName ? errors.lastName.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='userName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='User Name*'
                    placeholder='Enter User Name'
                    autoComplete='false'
                    error={!!errors.userName}
                    helperText={errors.userName ? errors.userName.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='userEmail'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Email*'
                    placeholder='Enter Email'
                    error={!!errors.userEmail}
                    helperText={errors.userEmail ? errors.userEmail.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='userPassword'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Password*'
                    placeholder='············'
                    autoComplete='false'
                    id='form-validation-basic-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.userPassword}
                    helperText={errors.userPassword ? errors.userPassword.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='userMobile'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mobile No*'
                    type='tel'
                    placeholder='Enter Mobile No'
                    error={!!errors.userMobile}
                    helperText={errors.userMobile ? errors.userMobile.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='userDepartment'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Department*'
                    placeholder='Enter Department'
                    {...(errors.userDepartment && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='userRole'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={rolelist}
                    id='autocomplete-controlled'
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue('userRole', newvalue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: any) => option.roleName || ''}
                    renderInput={params => (
                      <CustomTextField
                        placeholder='Select Role'
                        {...params}
                        label='Role*'
                        {...(watch('userRole') === null &&
                          errors.userRole && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='companyId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={allCompanies}
                    id='autocomplete-controlled'
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue('companyId', newvalue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: any) => option.companyName || ''}
                    renderInput={params => (
                      <CustomTextField
                        placeholder='Select Company'
                        {...params}
                        label='Company*'
                        {...(watch('companyId') === null &&
                          errors.companyId && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='userType'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={UserType}
                    id='autocomplete-controlled'
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue('userType', newvalue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: any) => option.userTypeName || ''}
                    renderInput={params => (
                      <CustomTextField
                        placeholder='Select User type'
                        {...params}
                        label='User type*'
                        {...(watch('userType') === null &&
                          errors.companyId && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='isActive'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='Active' {...field} error={Boolean(errors.isActive)}>
                    <MenuItem value='true'>Yes</MenuItem>
                    <MenuItem value='false'>No</MenuItem>
                  </CustomTextField>
                )}
              />
              {errors.isActive && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>

            <Grid item xs={12} className='flex gap-4'>
              <Button variant='contained' type='submit'>
                Save
              </Button>
              <Button variant='tonal' color='secondary' type='reset' onClick={() => reset()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddUser