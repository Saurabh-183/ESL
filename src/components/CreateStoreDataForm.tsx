"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
} from "@mui/material";

interface Product {
    Id: string;
    specification?: string;
    unit?: string;
    price?: string;
    memberPrice?: string;
    origin?: string;
    Title?: string;
    offerPrice?: string;
    MRP?: string;
    mukesh?: string;
}

interface Props {
    open: boolean;
    mode: "add" | "edit";
    columns: (keyof Product)[];
    formData: Product;
    setFormData: React.Dispatch<React.SetStateAction<Product>>;
    onClose: () => void;
    onSubmit: () => void;
}

const numericFields: (keyof Product)[] = [
    "price",
    "memberPrice",
    "offerPrice",
    "MRP",
];

const alphaFields: (keyof Product)[] = ["origin", "Title"];
const requiredFields: (keyof Product)[] = ["Id"];

export default function ProductFormDialog({
                                              open,
                                              mode,
                                              columns,
                                              formData,
                                              setFormData,
                                              onClose,
                                              onSubmit,
                                          }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    /* 🔹 Validate input */
    const validateField = (field: keyof Product, value: string) => {
        let error = "";

        if (requiredFields.includes(field) && !value.trim()) {
            error = "This field is required";
        }

        if (numericFields.includes(field) && value && !/^\d*\.?\d*$/.test(value)) {
            error = "Only numbers allowed";
        }

        if (alphaFields.includes(field) && value && !/^[A-Za-z\s]*$/.test(value)) {
            error = "Only alphabets allowed";
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return !error;
    };

    /* 🔹 Submit validation */
    const handleSubmit = () => {
        let valid = true;

        columns.forEach((field) => {
            const value = String(formData[field] || "");
            if (!validateField(field, value)) {
                valid = false;
            }
        });

        if (!valid) return;
        onSubmit();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {mode === "add" ? "Add Product" : "Edit Product"}
            </DialogTitle>

            <DialogContent>
                {columns.map((col) => (
                    <div key={col} style={{ marginBottom: 14 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {col}
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            value={formData[col] || ""}
                            error={Boolean(errors[col])}
                            helperText={errors[col]}
                            disabled={mode === "edit" && col === "Id"}
                            onChange={(e) => {
                                const value = e.target.value;

                                /* Input restriction */
                                if (
                                    numericFields.includes(col) &&
                                    !/^\d*\.?\d*$/.test(value)
                                )
                                    return;

                                if (
                                    alphaFields.includes(col) &&
                                    !/^[A-Za-z\s]*$/.test(value)
                                )
                                    return;

                                setFormData((prev) => ({
                                    ...prev,
                                    [col]: value,
                                }));

                                validateField(col, value);
                            }}
                        />
                    </div>
                ))}
            </DialogContent>

            <DialogActions className="flex justify-end gap-4 mr-3 mt-1">
                <button
                    onClick={onClose}
                    className="px-6 py-[10px] rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSubmit}
                    className="px-6 py-[10px] rounded-lg bg-[#262262] text-white"
                >
                    {mode === "add" ? "Save" : "Update"}
                </button>
            </DialogActions>
        </Dialog>
    );
}
