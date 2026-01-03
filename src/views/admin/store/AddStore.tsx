'use client'

// React Imports
import { useState, useEffect } from 'react'

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

// Styled Component Imports

import type { FormValues, stateObjType } from '../company/AddCompany'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Chip } from '@mui/material'

export type companyObjType = {
  id: number
  companyName: string
}

export type ServiceTypes = {
  id: number
  serviceName: string
}

export type FormLocationValues = {
  locationName: string
  locationAddress1: string
  locationAddress2: string
  locationCity: string
  locationState: stateObjType | null | number
  companyId: companyObjType | null | number
  isActive: boolean
  serviceType: ServiceTypes[] | []
}

type FormId = {
  id: number
}
export type FormCompany = FormValues & FormId

export type Statetype = {
  id: number
  stateName: string
  isActive: boolean
}

const AddStore: React.FC = () => {
  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormLocationValues>({
    defaultValues: {
      locationName: '',
      locationAddress1: '',
      locationAddress2: '',
      locationCity: '',
      locationState: null,
      companyId: null,
      isActive: true,
      serviceType: []
    }
  })

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP
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

  const onSubmit = async (data: FormLocationValues) => {
    try {
      let serviceType = data.serviceType.map((ele)=> ele.serviceName)
      const newData: any = { ...data }
      newData.locationName = newData.locationName.trim()
      newData.locationAddress1 = newData.locationAddress1.trim()
      newData.locationAddress2 = newData.locationAddress2.trim()
      newData.locationCity = newData.locationCity.trim()
      newData.locationState = newData.locationState?.stateName
      newData.companyId = newData.companyId?.id
      newData.isActive = newData.isActive === true
      newData.serviceType = serviceType

      const response = await fetch(`${API_URL}/admin/create-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newData)
      })

      const result = await response.json()
      if (result.message === 'success' && result.status === 200) {
        toast.success('Location created successfully')
        reset() // Reset form after successful submission
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const [allCompanies, setAllCompanies] = useState([])
  const [states, setStates] = useState([])

  useEffect(() => {
    if (token !== '') {
      fetchData()
      fetchState()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/company-list`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        const newData = data.map((ele: any) => {
          return { id: ele.id, companyName: ele.companyName }
        })

        setAllCompanies(newData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchState = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/state-list`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        setStates(data.stateData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const serviceType = [
    {
      id: 1,
      serviceName: 'Dining'
    },
    {
      id: 2,
      serviceName: 'Take away'
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
                name='locationName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name*'
                    placeholder='Enter Name'
                    error={!!errors.locationName}
                    helperText={errors.locationName ? errors.locationName.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='locationAddress1'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Address 1*'
                    placeholder='Enter Address 1'
                    error={!!errors.locationAddress1}
                    helperText={errors.locationAddress1 ? errors.locationAddress1.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='locationAddress2'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Address 2*'
                    placeholder='Enter Address 2'
                    error={!!errors.locationAddress2}
                    helperText={errors.locationAddress2 ? errors.locationAddress2.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='locationCity'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='City*'
                    placeholder='Enter City'
                    error={!!errors.locationCity}
                    helperText={errors.locationCity ? errors.locationCity.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='locationState'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={states}
                    id='autocomplete-controlled'
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue('locationState', newvalue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: any) => option.stateName || ''}
                    renderInput={params => (
                      <CustomTextField
                        placeholder='Select State'
                        {...params}
                        label='State*'
                        {...(watch('locationState') === null &&
                          errors.locationState && { error: true, helperText: 'This field is required.' })}
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
                name='serviceType'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomAutocomplete
                    multiple
                    limitTags={2}
                    options={serviceType}
                    onChange={(e, values) => {
                      const serviceName = e.currentTarget.innerHTML
                      let count = 0

                      values.forEach((ele: any) => {
                        if (ele.serviceName === serviceName) {
                          count++
                        }
                      })

                      if (count > 1) {
                        return
                      }

                      field.onChange(values)
                    }}
                    value={field.value}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    id='autocomplete-limit-tags'
                    getOptionLabel={(option: any) => option.serviceName || ''}
                    renderInput={params => (
                      <CustomTextField {...params} label='Service Type*' placeholder='Select service type' />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip label={option.serviceName} {...(getTagProps({ index }) as {})} key={index} size='small' />
                      ))
                    }
                  />
                )}
              />
              {errors.serviceType && <FormHelperText error>This field is required.</FormHelperText>}
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

export default AddStore
