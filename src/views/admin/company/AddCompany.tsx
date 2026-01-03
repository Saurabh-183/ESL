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

import { Avatar, IconButton, List, ListItem, Typography } from '@mui/material'

import { useDropzone } from 'react-dropzone'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

import CustomTextField from '@core/components/mui/TextField'

export type stateObjType = {
  id: number
  stateName: string
}

export type FormValues = {
  companyName: string
  address1: string
  address2: string
  city: string
  state: stateObjType | null
  isActive: string
}
export interface Props {
  API_URL: string | undefined
}

type FileProp = {
  name: string
  type: string
  size: number
}

const AddCompany: React.FC = () => {
  // States
  const [states, setStates] = useState([])
  const [files, setFiles] = useState<File[]>([])
  const [token, setToken] = useState('')

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
      companyName: '',
      address1: '',
      address2: '',
      city: '',
      state: null,
      isActive: '1'
    }
  })

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  // const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

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

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const onSubmit = async (data: FormValues) => {
    try {
      if (files.length === 0) {
        return
      }
      const newData: any = { ...data }

      newData.state = newData.state?.stateName

      const formData = new FormData()

      files.forEach(file => formData.append('file', file))
      formData.append('companyName', newData.companyName.trim())
      formData.append('companyAddress1', newData.address1.trim())
      formData.append('companyAddress2', newData.address2.trim())
      formData.append('companyCity', newData.city.trim())
      formData.append('companyState', newData.state)
      formData.append('isActive', newData.isActive)

      const response = await fetch(`${API_URL}/admin/create-company`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()
      if (result.message === 'success' && result.status === 200) {
        toast.success('Company created successfully')
        setFiles([])
        reset() // Reset form after successful submission
      } else {
        toast.error('Failed to create company')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    if (token) fetchState()
  }, [token])

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

        const newData = data?.stateData?.map((ele: any) => {
          return { id: ele.id, stateName: ele.stateName }
        })

        setStates(newData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
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
                name='companyName'
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: value => value.trim() !== '' || 'This field is required.'
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={'Name*'}
                    placeholder='Enter Name'
                    error={!!errors.companyName}
                    helperText={errors.companyName ? errors.companyName.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='address1'
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
                    error={!!errors.address1}
                    helperText={errors.address1 ? errors.address1.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='address2'
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
                    error={!!errors.address2}
                    helperText={errors.address2 ? errors.address2.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='city'
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
                    error={!!errors.city}
                    helperText={errors.city ? errors.city.message : ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='state'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={states}
                    id='autocomplete-controlled'
                    value={value}
                    onChange={(e: any, newvalue: any) => {
                      setValue('state', newvalue)
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: any) => option.stateName || ''}
                    renderInput={params => (
                      <CustomTextField
                        placeholder='Select State'
                        {...params}
                        label='State*'
                        {...(watch('state') === null &&
                          errors.state && { error: true, helperText: 'This field is required.' })}
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
                    <MenuItem value='1'>Yes</MenuItem>
                    <MenuItem value='0'>No</MenuItem>
                  </CustomTextField>
                )}
              />
              {errors.isActive && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>

            <Grid item xs={12} className='w-full flex justify-between'>
              <div className='footer gap-4'>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div className='flex items-center flex-col'>
                    <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                      <i className='tabler-upload' />
                    </Avatar>
                    <Typography variant='h4' className='mbe-2.5'>
                      Drop files here or click to upload.
                    </Typography>
                    <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
                    <Typography>Max 2 files and max size of 2 MB</Typography>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} className='mt-4'>
              <>
                {files.length ? (
                  <>
                    <List>{fileList}</List>
                    <div className='buttons'>
                      <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                        Remove All
                      </Button>
                      <Button variant='contained'>Upload Files</Button>
                    </div>
                  </>
                ) : null}
              </>
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

export default AddCompany
