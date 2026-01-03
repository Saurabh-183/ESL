// components/AddStoreModal.tsx
'use client'; 
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from '@mui/material'
import { X, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (data: any) => void
  initialData?: any
}

export default function AddStoreModal({ open, onClose, onConfirm, initialData }: Props) {
  const [store, setStore] = useState({
    number: '',
    name: '',
    address: '',
    image: '',
  })

  useEffect(() => {
    if (initialData) setStore(initialData)
    else setStore({ number: '', name: '', address: '', image: '' })
  }, [initialData, open])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setStore({ ...store, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex justify-between items-center">
        {initialData ? 'Edit Store' : 'Add Store'}
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2">
        <TextField
          label="Store no."
          required
          value={store.number}
          onChange={(e) => setStore({ ...store, number: e.target.value })}
        />
        <TextField
          label="Store name"
          required
          value={store.name}
          onChange={(e) => setStore({ ...store, name: e.target.value })}
        />
        <TextField
          label="Store address"
          required
          value={store.address}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
        />

        {store.image ? (
          <div className="relative">
            <img src={store.image} alt="Preview" className="w-32 h-32 rounded" />
            <IconButton
              size="small"
              className="absolute top-0 right-0"
              onClick={() => setStore({ ...store, image: '' })}
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        ) : (
          <Button variant="outlined" component="label" startIcon={<Plus />}>
            Upload Image
            <input hidden type="file" onChange={handleImage} />
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button className='bg-black'
          onClick={() => {
            onConfirm(store)
            onClose()
          }}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
