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

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

// Components Imports
import { Chip } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

export type RoleTypes = {
  id: number
  roleName: string
}

export type PermissionTypes = {
  permissionId: number
  permissionName: string
}

export type FormValues = {
  roleName: RoleTypes | null | number
  permissionName: PermissionTypes[]
}


const UserPermission: React.FC = () => {
  //State
  const [roledata, setRoleData] = useState([])
  const [permissiondata, setPermissionData] = useState<PermissionTypes[]>([])
  const [permissionbyrole, setPermissionByRole] = useState([])

  // state
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

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP

  // Hooks
  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      roleName: null,
      permissionName: []
    }
  })

  useEffect(() => {
    if(token !== ""){
      FetchRole()
      FetchPermission()
    }
  }, [token])

  useEffect(() => {
    const num: any = watch('roleName')

    if (num !== null && num !== null && num.id !== 0) {
      FetchPermissionByRoleId(num.id)
    } else {
      setValue('permissionName', [])
    }
  }, [watch('roleName')])

  const FetchRole = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list-user-role`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        const newData = data.map((ele: any) => {
          return { id: ele.id, roleName: ele.roleName }
        })

        setRoleData(newData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const FetchPermissionByRoleId = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/admin/list-role-permission/?roleId=${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        setPermissionByRole(data)

        setValue('permissionName', data) //setValue('permissionName', new)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const FetchPermission = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list-user-permission`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        setPermissionData(data)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onSubmit = async (data: FormValues) => {
    type dataObj = { roleId: number; permissionId: number; isActive: boolean }
    const newdata: dataObj[] = []
    const result: dataObj[] = []

    const newData: any = { ...data }
    const permission: any = [...permissionbyrole]

    //Find the array of object that are in permission & are present in data array
    for (let i = 0; i < permission.length; i++) {
      for (let j = 0; j < newData.permissionName.length; j++) {
        if (
          permission[i].permissionId === newData.permissionName[j].permissionId ||
          permission[i].permissionId === newData.permissionName[j].id
        ) {
          result.push(permission[i])
        }
      }
    }

    //filter all array which are not present in permissionbyrole array

    const results = permissionbyrole.filter(
      (ele: dataObj) => !result.some((item: dataObj) => ele.permissionId === item.permissionId)
    )

    data?.permissionName?.forEach((item: any) => {
      newdata.push({
        roleId: newData.roleName.id,
        permissionId: item.permissionId ?? item.id,
        isActive: true
      })
    })

    if (results.length !== 0) {
      results.forEach((ele: dataObj) => {
        newdata.push({
          roleId: newData.roleName.id,
          permissionId: ele.permissionId,
          isActive: false
        })
      })
    }

    try {
      const response = await fetch(`${API_URL}/admin/add-role-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newdata)
      })

      if (response.ok) {
        toast.success('User Permission created successfully')
        reset() // Reset form after successful submission
      } else {
        toast.error('Failed to create User Permission')
      }
    } catch (error) {
      console.error('Error creating user permission:', error)
      toast.error('Failed to create user permission')
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
                name='roleName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <CustomAutocomplete
                    fullWidth
                    options={roledata}
                    onChange={(e: any, newvalue: any) => {
                      setValue('roleName', newvalue)
                    }}
                    value={value}
                    id='autocomplete-controlled'
                    getOptionLabel={option => option.roleName || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={params => <CustomTextField placeholder='Enter Role' {...params} label='Role Name*' />}
                  />
                )}
              />
              {errors.roleName && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='permissionName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomAutocomplete
                    multiple
                    limitTags={2}
                    options={permissiondata}
                    onChange={(e, values) => {
                      const permissionName = e.currentTarget.innerHTML
                      let count = 0

                      values.forEach((ele: any) => {
                        if (ele.permissionName === permissionName) {
                          count++
                        }
                      })

                      if (count > 1) {
                        return
                      }

                      field.onChange(values)
                    }}
                    value={field.value}
                    isOptionEqualToValue={(option, value) => option.id === value.permissionId || option.id === value.id}
                    id='autocomplete-limit-tags'
                    getOptionLabel={(option: any) => option.permissionName || ''}
                    renderInput={params => (
                      <CustomTextField {...params} label='Permissions*' placeholder='Select Permission' />
                    )}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          label={option.permissionName}
                          {...(getTagProps({ index }) as {})}
                          key={index}
                          size='small'
                        />
                      ))
                    }
                  />
                )}
              />
              {errors.permissionName && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>

            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}

            <Grid item xs={12} className='flex gap-4 mt-32'>
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

export default UserPermission
