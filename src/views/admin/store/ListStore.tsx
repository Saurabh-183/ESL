'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { Column, Table, ColumnFiltersState, FilterFn, ColumnDef } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import { Grid } from '@mui/material'

import { toast } from 'react-toastify'

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

import type { FormValues } from '../company/AddCompany'

import EditLocation from '@/components/dialogs/edit-location'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
//type
export type LocationType = {
  locationId: number
  locationName: string
}

export type DataType = {
  id: number | null
  serialNo: string
  locationAddress1: string
  locationAddress2: string
  locationCity: string
  locationName: string
  locationState: LocationType | null
  companyId: number | string
  qrCodePath: string
  isActive: boolean
}
export type LocationTypes = {
  locationId: number | null
  locationName: string
  locationAddress1: string
  locationAddress2: string
  locationCity: string
  locationState: LocationType | null
  companyId: { id: string; companyName: string } | null
  qrCodePath: string
  isActive: boolean
}

type FormId = {
  id: number
}
export type FormCompany = FormValues & FormId

// Column Definitions
const columnHelper = createColumnHelper<DataType>()

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & TextFieldProps) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const Filter = ({ column, table }: { column: Column<any, unknown>; table: Table<any> }) => {
  // Vars
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  if (column.id === 'id') {
    return
  }

  return typeof firstValue === 'number' ? (
    <div className='flex gap-x-2'>
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
        placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
      />
      <CustomTextField
        fullWidth
        type='number'
        sx={{ minInlineSize: 100, maxInlineSize: 125 }}
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
        placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
      />
    </div>
  ) : (
    <CustomTextField
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder='Search...'
    />
  )
}

const ListStore: React.FC = () => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<DataType[]>([])
  const [companydata, setCompanyData] = useState([])
  const [selectedcompany, setSelectedCompany] = useState<any>(null)

  const [open, setOpen] = useState(false)
  const [id, setId] = useState(null)

  const [locationdata, setLocationData] = useState<LocationTypes>({
    locationId: null,
    locationName: '',
    locationAddress1: '',
    locationAddress2: '',
    locationCity: '',
    locationState: null,
    companyId: null,
    qrCodePath: '',
    isActive: true
  })
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

  const userdetails: any = typeof window !== 'undefined' ? localStorage.getItem('userDetails') : null

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP

  useEffect(() => {
    if (selectedcompany !== null && token) {
      fetchLocationList()
    } else if (selectedcompany === null && data.length !== 0) {
      setData([])
    }
  }, [selectedcompany])

  useEffect(() => {
    if (id !== null) {
      data.forEach(location => {
        if (location.id === id) {
          setLocationData({
            locationId: location.id,
            locationName: location.locationName,
            locationAddress1: location.locationAddress1,
            locationAddress2: location.locationAddress2,
            locationCity: location.locationCity,
            locationState: location.locationState,
            companyId: selectedcompany,
            qrCodePath: location.qrCodePath,
            isActive: location.isActive
          })
        }
      })
    }
  }, [id, open])

  const UpdateLocation = async (userData: LocationTypes) => {
    try {
      const NewData: any = { ...userData }

      userData.companyId = NewData.companyId.id

      userData.locationState = NewData.locationState.stateName

      const response = await fetch(`${API_URL}/admin/update-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        toast.success('Location updated successfully')

        if (selectedcompany !== null) {
          await fetchLocationList()
        }
      } else {
        toast.error('Failed to update location')
      }

      setOpen(false)
    } catch (error) {
      toast.error('Failed to update location')
    }
  }

  const fetchLocationList = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/location-list?companyId=${selectedcompany.id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const NewData: DataType[] = []

        data.forEach((ele: DataType, i: number) => {
          const serial = i + 1

          ele.qrCodePath = API_URL + ele.qrCodePath
          NewData.push({ ...ele, serialNo: serial.toString() })
        })
        setData(NewData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (token !== '') {
      fetchData()
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

        setCompanyData(newData)
      } else {
        console.error('Failed to fetch locations:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Hooks
  const columns = useMemo<ColumnDef<DataType, any>[]>(
    () => [
      columnHelper.accessor('serialNo', {
        cell: info => info.getValue(),
        header: 'Serial No'
      }),
      columnHelper.accessor('locationName', {
        cell: info => info.getValue(),
        header: 'Name'
      }),
      columnHelper.accessor('locationAddress1', {
        cell: info => info.getValue(),
        header: 'Address1'
      }),
      columnHelper.accessor('locationAddress2', {
        cell: info => info.getValue(),
        header: 'Address2'
      }),
      columnHelper.accessor('locationCity', {
        cell: info => info.getValue(),
        header: 'City'
      }),
      columnHelper.accessor('qrCodePath', {
        cell: info => {
          return (
            <a href={info.getValue()} download target='blank'>
              <img src={info.getValue()} alt='qr-code' width={60} height={40} />
            </a>
          )
        }
      }),
      columnHelper.accessor('id', {
        cell: info => (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='14'
            width='14'
            viewBox='0 0 512 512'
            onClick={() => {
              setId(info.getValue())
              setOpen(true)
            }}
          >
            <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
          </svg>
        ),
        header: 'Action'
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters[0]?.id])

  return (
    <Card>
      <CardHeader
        title='Location List'
        action={
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search all columns...'
          />
        }
      />
      <Grid item xs={12} sm={4} className='px-6 pb-4'>
        <CustomAutocomplete
          fullWidth
          options={companydata}
          id='autocomplete-controlled'
          value={selectedcompany}
          onChange={(e: any, newvalue: any) => {
            setSelectedCompany(newvalue)
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option: any) => option.companyName || ''}
          renderInput={params => <CustomTextField placeholder='Select Company' {...params} label='Company' />}
        />
      </Grid>
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                              desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                          {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
        <EditLocation
          open={open}
          setOpen={setOpen}
          data={locationdata}
          API_URL={API_URL}
          UpdateLocation={UpdateLocation}
        />
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default ListStore
