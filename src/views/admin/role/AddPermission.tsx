'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import { useEffect, useState } from 'react'

export type FormValues = {
  permissionName: string
  isActive: boolean
}


const AddPermission: React.FC = () => {
  // Hooks
      const [token, setToken] = useState('')
    
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

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      permissionName: '',
      isActive: true
    }
  })

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP

  const onSubmit = async (data: FormValues) => {
    try {
      data.isActive = data.isActive === true
      data.permissionName = data.permissionName.trim()

      const response = await fetch(`${API_URL}/admin/add-user-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json() // Parse JSON response

      if (result.message === 'success' && result.status === 200) {
        toast.success('Permission created successfully')
        reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

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
                name='permissionName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Permission Name*'
                    placeholder='Enter Permission Name'
                    error={!!errors.permissionName}
                    helperText={errors.permissionName ? errors.permissionName.message : ''}
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

export default AddPermission
