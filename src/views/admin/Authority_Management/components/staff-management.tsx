"use client";
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { Checkbox } from "@/views/admin/Authority_Management/components/ui/checkbox";
import { Input } from "@/views/admin/Authority_Management/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/views/admin/Authority_Management/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function StaffManagement() {
  const [open, setOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [status, setStatus] = useState("All");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [form, setForm] = useState({
    username: "",
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    password: "",
    passwordType: "auto",
    reset: true,
  });

  const handleAddStaff = () => {
    if (!form.username || !form.email) {
      toast.error("Username and Email are required");
      return;
    }
    const newStaff = { ...form, id: Date.now() };
    setStaffList((prev) => [...prev, newStaff]);
    toast.success("Staff added successfully");
    setOpen(false);
    setForm({
      username: "",
      name: "",
      mobile: "",
      email: "",
      remarks: "",
      password: "",
      passwordType: "auto",
      reset: true,
    });
  };



  return (
    <div>
      <div className="flex gap-4 mb-4">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="All">All status</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Disable">Disable</MenuItem>
          </Select>
        </FormControl>

        <div className="flex items-center border px-2 rounded">
          <Input
            placeholder="Search"
            className="border-none focus:outline-none"
          />
          <Search size={16} className="text-gray-400" />
        </div>

        <Button
          variant="default"
          className="bg-[#262262] active:scale-90 transition-transform duration-75 hover:cursor-pointer"
          onClick={() => alert("Import Excel logic")}
        >
          <Upload size={16} className="mr-2 " />
          Batch Add
        </Button>

        <button
          onClick={() => setShowDeleteDialog(true)}
          disabled={selectedIds.length === 0}
          className={`border-[1.5px] px-4 py-[8px] rounded-md ${selectedIds.length === 0
              ? "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
              : "text-[#ff5757] border-[#ff5757] bg-gray-100 hover:bg-red-50"
            } active:scale-90 transition-transform duration-75`}
        >
          <Trash2 size={16} className="mr-2 inline-block" /> Delete
        </button>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#262262] text-[#fff] px-4 py-[10px] rounded border-[1.5px] border-[#262262]  active:scale-95 transition-transform duration-100"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <Checkbox
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === staffList.length
                }
                onCheckedChange={(checked) =>
                  setSelectedIds(checked ? staffList.map((s) => s.id) : [])
                }
              />
            </th>
            <th>Username</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Status</th>
            <th>Operate</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No Data
              </td>
            </tr>
          ) : (
            staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="text-center">
                  <Checkbox
                    checked={selectedIds.includes(staff.id)}
                    onCheckedChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(staff.id)
                          ? prev.filter((id) => id !== staff.id)
                          : [...prev, staff.id]
                      )
                    }
                  />
                </td>
                <td className="text-center">{staff.username}</td>
                <td className="text-center">{staff.name}</td>
                <td className="text-center">{staff.mobile}</td>
                <td className="text-center">{staff.email}</td>
                <td className="text-center">{"Normal"}</td>
                <td className="text-center">
                  <Pencil className="h-4 w-4 cursor-pointer" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <div>1 page in total</div>
        <div className="flex gap-2 items-center">
          <select className="border rounded px-2 py-1 text-sm">
            <option>8/page</option>
            <option>10/page</option>
          </select>
          <span>Go to</span>
          <Input type="number" className="w-16" />
          <button className="bg-[#262262] text-white px-4 py-[10px] rounded-lg hover:cursor-pointer">Confirm</button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogContent className="mt-16 ml-20 mb-2 "> */}
        <DialogContent
          className="mt-10 rounded-lg py-4 ml-20 mb-2 max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader className="text-lg font-semibold">Add</DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="* Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Mobile phone"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
            <Input
              placeholder="* Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Remarks"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />

            <div>
              <label className="text-sm font-medium">Set password</label>
              <div className="flex flex-col gap-1 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.passwordType === "auto"}
                    onChange={() => setForm({ ...form, passwordType: "auto" })}
                  />
                  Create password automatically
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.passwordType === "manual"}
                    onChange={() =>
                      setForm({ ...form, passwordType: "manual" })
                    }
                  />
                  Set login password
                </label>
                {form.passwordType === "manual" && (
                  <div className="relative mt-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10"
                      value={form.password || ""}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Reset password or not
              </label>
              <div className="flex flex-col gap-1 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.reset}
                    onChange={() => setForm({ ...form, reset: true })}
                  />
                  Password should be reset when next login
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!form.reset}
                    onChange={() => setForm({ ...form, reset: false })}
                  />
                  No need reset
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-[10px] rounded-lg hover:cursor-pointer border border-gray-300" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="bg-[#262262] text-white px-4 py-[10px] rounded-lg hover:cursor-pointer font-medium" onClick={handleAddStaff}>Confirm</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
