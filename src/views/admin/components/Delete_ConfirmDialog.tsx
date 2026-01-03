// components/DeleteConfirmDialog.tsx

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  storeName: string
}

export default function DeleteConfirmDialog({ open, onConfirm, onCancel, storeName }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete <strong>{storeName}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
