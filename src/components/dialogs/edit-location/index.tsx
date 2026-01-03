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
import type { LocationTypes } from '@/views/admin/store/ListStore'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

type EditLocationProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data: LocationTypes
  API_URL: string | undefined
  UpdateLocation: any
}

const EditLocation = ({ open, setOpen, data, API_URL, UpdateLocation }: EditLocationProps) => {
  // States
  const [userData, setUserData] = useState<LocationTypes>(data)
  const [states, setStates] = useState([])
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (data) {
      setUserData(data)
      fetchState(data)
    }
  }, [data, open])

  const fetchState = async (locationdata: any) => {
    try {
      const response = await fetch(`${API_URL}/admin/state-list`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

        const newData = data.map((ele: any) => {
          if (ele.stateName === locationdata.locationState) {
            setUserData({ ...locationdata, locationState: ele })
          }

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
        Update Location
      </DialogTitle>
      <form
        onSubmit={e => {
          e.preventDefault()
          UpdateLocation(userData)
        }}
      >
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Location Name'
                placeholder='Enter Location Name'
                value={userData?.locationName}
                onChange={e => setUserData({ ...userData, locationName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Location Address 1'
                placeholder='Enter Location Address 1'
                value={userData?.locationAddress1}
                onChange={e => setUserData({ ...userData, locationAddress1: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Location Address 2'
                placeholder='Enter Location Address 2'
                value={userData?.locationAddress2}
                onChange={e => setUserData({ ...userData, locationAddress2: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Location City'
                placeholder='Enter Location City'
                value={userData?.locationCity}
                onChange={e => setUserData({ ...userData, locationCity: e.target.value })}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='State'
                value={userData?.locationState}
                onChange={e => {
                  setUserData({ ...userData, locationState: e.target.value })
                }}
              >
                {states.map((ele: Statetype, index: number) => (
                  <MenuItem key={index} value={ele.id}>
                    {ele.stateName}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                fullWidth
                options={states}
                id='autocomplete-controlled'
                value={userData?.locationState}
                onChange={(e: any, newvalue: any) => {
                  setUserData({ ...userData, locationState: newvalue })
                }}
                isOptionEqualToValue={(option, value) =>
                  option.stateName === value.stateName || option.stateName === value
                }
                getOptionLabel={(option: any) => option.stateName || ''}
                renderInput={params => <CustomTextField placeholder='Select State' {...params} label='State' />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Active'
                value={userData?.isActive}
                onChange={e => setUserData({ ...userData, isActive: e.target.value == 'true' })}
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

export default EditLocation
