'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'

// Component Imports

import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import type { UserTypes } from '@/views/admin/user/ListUser'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  API_URL: string | undefined
  data: UserTypes
  UpdateUserInfo: any
}

const EditUserInfo = ({ open, setOpen, API_URL, data, UpdateUserInfo }: EditUserInfoProps) => {
  // States
  const [userData, setUserData] = useState<UserTypes>(data)

  const [rolelist, setRoleList] = useState([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (data.userRole !== null) {
      setUserData(data)
      fetchUserRole(data)
    }
  }, [data, open])

  const fetchUserRole = async (roleData: any) => {
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
          if (ele.id === +roleData.userRole) {
            setUserData({ ...roleData, userRole: ele })
          }

          return { id: ele.id, roleName: ele.roleName }
        })

        setRoleList(newData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  console.log('data', data, userData)
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Update User
      </DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          UpdateUserInfo(userData)
        }}
      >
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='First Name'
                placeholder='Enter First Name'
                value={userData?.firstName}
                onChange={e => setUserData({ ...userData, firstName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Last Name'
                placeholder='Enter Last Name'
                value={userData?.lastName}
                onChange={e => setUserData({ ...userData, lastName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='User Name'
                placeholder='Enter User Name'
                value={userData?.userName}
                onChange={e => setUserData({ ...userData, userName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                placeholder='Enter Email Name'
                value={userData?.userEmail}
                onChange={e => setUserData({ ...userData, userEmail: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Mobile No.'
                placeholder='Enter Mobile No.'
                value={userData?.userMobile}
                onChange={e => setUserData({ ...userData, userMobile: +e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='User Department'
                placeholder='Enter User Department'
                value={userData?.userDepartment}
                onChange={e => setUserData({ ...userData, userDepartment: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                fullWidth
                options={rolelist}
                id='autocomplete-controlled'
                value={userData?.userRole}
                onChange={(e: any, newvalue: any) => {
                  setUserData({ ...userData, userRole: newvalue })
                }}
                isOptionEqualToValue={(option, value) =>
                  // console.log('option', option, value)
                  option.id === value.id
                }
                getOptionLabel={(option: any) => option.roleName || ''}
                renderInput={params => <CustomTextField placeholder='Select Role' {...params} label='Role' />}
              />
              {/* <CustomTextField
                fullWidth
                label='Role'
                placeholder='Enter Role'
                value={userData?.userRole}
                onChange={e => setUserData({ ...userData, userRole: +e.target.value })}
              /> */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Active'
                value={userData?.isActive}
                onChange={e => {
                  setUserData({ ...userData, isActive: e.target.value === 'true' })
                }}
              >
                <MenuItem value='true'>Yes</MenuItem>
                <MenuItem value='false'>No</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Update
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserInfo
