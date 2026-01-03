"use client";

import React from "react";

import { X } from "lucide-react";
import {
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

interface AddTemplateModalProps {
    open: boolean;
    templateName: string;
    setTemplateName: (v: string) => void;
    screenSize: string;
    setScreenSize: (v: string) => void;
    selectColor: string;
    setSelectColor: (v: string) => void;
    templateDataType: string;
    setTemplateDataType: (v: string) => void;
    screenOrientation: string;
    setScreenOrientation: (v: string) => void;
    onClose: () => void;
    onConfirm: () => void;
    screenSizes: string[];
    colors: string[];
}

export default function AddTemplateModal({open, templateName, setTemplateName, screenSize, setScreenSize, selectColor, setSelectColor, templateDataType, setTemplateDataType, screenOrientation, setScreenOrientation, onClose, onConfirm, screenSizes, colors,}: AddTemplateModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] max-w-md rounded-xl p-6 mt-10 shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add Template</h2>
                    <button onClick={onClose} className="hover:cursor-pointer">
                        <X />
                    </button>
                </div>
                <div className="space-y-3 overflow-y-auto h-80">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Template name
                        </label>
                        <input
                            className="w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#262262]"
                            value={templateName}
                            placeholder="Enter Template Name"
                            onChange={(e) => setTemplateName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Screen size
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={screenSize}
                                displayEmpty
                                onChange={(e) => setScreenSize(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? selected : <span className="text-gray-400">Select size</span>
                                }
                            >
                                <MenuItem value="" disabled>
                                    Select size
                                </MenuItem>
                                {screenSizes.slice(1).map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>


                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Selectable color
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={selectColor}
                                displayEmpty
                                onChange={(e) => setSelectColor(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? selected : (
                                        <span className="text-gray-400">Select color</span>
                                    )
                                }
                            >
                                <MenuItem value="" disabled>
                                    Select color
                                </MenuItem>
                                {colors.slice(1).map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>


                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Template type
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={templateDataType}
                                displayEmpty
                                onChange={(e) => setTemplateDataType(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? selected : (
                                        <span className="text-gray-400">Select template type</span>
                                    )
                                }
                            >
                                <MenuItem value="" disabled>
                                    Select template type
                                </MenuItem>
                                <MenuItem value="Single data template">
                                    Single data template
                                </MenuItem>
                                <MenuItem value="Multiple data template">
                                    Multiple data template
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Screen orientation
                        </label>
                        <FormControl fullWidth size="small">
                            <Select
                                value={screenOrientation}
                                displayEmpty
                                onChange={(e) => setScreenOrientation(e.target.value)}
                                renderValue={(selected) =>
                                    selected ? (
                                        `${selected}°`
                                    ) : (
                                        <span className="text-gray-400">Select orientation</span>
                                    )
                                }
                            >
                                <MenuItem value="" disabled>
                                    Select orientation
                                </MenuItem>

                                {["90", "180", "270", "360"].map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt}°
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[#262262] text-white rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
