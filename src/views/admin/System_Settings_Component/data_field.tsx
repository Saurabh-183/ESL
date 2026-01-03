"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button";
import "react-toastify/dist/ReactToastify.css";
import GateWaySettings from "./gateway_settigns";
import KeyTool from "./keytool";
import ParamSettings from "./param_settings";
import ResourceManagement from "./resource_management";
import SystemConfigPage from "./system_config";

// const [confirmDelete, setConfirmDelete] = useState<{
//   i: number;
//   idx: number;
// } | null>(null);

// const requestDeleteRow = (i: number, idx: number) => {
//   setConfirmDelete({ i, idx });
// };

// const confirmDeleteRow = () => {
//   if (confirmDelete) {
//     const { i, idx } = confirmDelete;
//     setFieldData((prev) => {
//       const c = [...prev];
//       c[i] = c[i].filter((_: number, j: number) => j !== idx);
//       return c;
//     });
//     toast.success(`Row deleted from "${FIELD_TYPES[confirmDelete.i].label}"`);
//     setConfirmDelete(null);
//   }
// };

interface FieldType {
  label: string;
  columns: string[];
}
type FieldRow = { [key: string]: string };

const TABS = [
  "Data field",
  "System configuration",
  "Resource management",
  "Gateway settings",
  "Param settings",
  "KeyTool",
] as const;

const FIELD_TYPES: FieldType[] = [
  { label: "Ordinary field", columns: ["ID", "Type", "Name", "Prefix"] },
  { label: "Icon field", columns: ["ID", "Name", "Icon Library"] },
  { label: "Image field", columns: ["ID", "Name"] },
  { label: "Video field", columns: ["ID", "Name"] },
  { label: "Carousel field", columns: ["ID", "Name"] },
];

export default function DataFieldsPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Data field");
  const [expanded, setExpanded] = useState<boolean[]>(
    Array(FIELD_TYPES.length).fill(false)
  );
  const [fieldData, setFieldData] = useState<FieldRow[][]>(
    FIELD_TYPES.map(() => [])
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (i: number) =>
    setExpanded((prev) => {
      const c = [...prev];
      c[i] = !c[i];
      return c;
    });

  const handleAddRow = (i: number) => {
    const newRow = FIELD_TYPES[i].columns.reduce(
      (a, c) => ({ ...a, [c]: "" }),
      {} as FieldRow
    );
    setFieldData((prev) => {
      const c = [...prev];
      c[i] = [...c[i], newRow];
      return c;
    });
    toast.success(`Row added to "${FIELD_TYPES[i].label}"`);
  };

  const handleDeleteRow = (i: number, idx: number) => {
    if (confirm("Are you sure?")) {
      setFieldData((prev) => {
        const c = [...prev];
        c[i] = c[i].filter((_, j) => j !== idx);
        return c;
      });
      toast.success(`Row deleted from "${FIELD_TYPES[i].label}"`);
    }
  };

  const handleMoveRow = (i: number, idx: number, dir: number) =>
    setFieldData((prev) => {
      const c = [...prev];
      const arr = [...c[i]];
      const t = arr[idx + dir];
      if (t) {
        arr[idx + dir] = arr[idx];
        arr[idx] = t;
        c[i] = arr;
        toast.info(
          `Row moved ${dir > 0 ? "down" : "up"} in "${FIELD_TYPES[i].label}"`
        );
      }
      return c;
    });

  const handleChange = (i: number, idx: number, key: string, v: string) =>
    setFieldData((prev) => {
      const c = [...prev];
      const arr = [...c[i]];
      arr[idx] = { ...arr[idx], [key]: v };
      c[i] = arr;
      return c;
    });

  const handleConfirm = () => {
    console.log("Saved data:", fieldData);
    toast.success("All data fields saved successfully!");
  };

  // const handleExport = () => {
  //   const wb = XLSX.utils.book_new();
  //   FIELD_TYPES.forEach((f, i) => {
  //     const data = fieldData[i];
  //     const sheet = XLSX.utils.json_to_sheet([...data]);
  //     XLSX.utils.book_append_sheet(wb, sheet, f.label);
  //   });
  //   XLSX.writeFile(wb, "datafields.xlsx");
  //   toast.success("Data exported to Excel!");
  // };

  // const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const wb = XLSX.read(reader.result, { type: "binary" });
  //     FIELD_TYPES.forEach((f, i) => {
  //       const sheet = wb.Sheets[f.label];
  //       if (sheet) {
  //         const arr = XLSX.utils.sheet_to_json<FieldRow>(sheet);
  //         setFieldData((prev) => {
  //           const c = [...prev];
  //           c[i] = [...c[i], ...arr];
  //           return c;
  //         });
  //       }
  //     });
  //     toast.success("Data imported from Excel!");
  //   };
  //   reader.readAsBinaryString(file);
  // };

  return (
    <div>
      <ToastContainer position="top-right" />
      <div className="flex space-x-4 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl hover:cursor-pointer hover:bg-gray-300 ${activeTab === t
                ? "border-[1.5px] border-[#262262] bg-white text-[#262262] font-semibold rounded-xl hover:cursor-pointer"
                : "text-gray-500"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Data field" && (
        <>
          {FIELD_TYPES.map((f, i) => (
            <div
              key={i}
              className="bg-gray-100 mb-4 rounded-xl overflow-hidden"
            >
              <div
                className="flex justify-between p-4 cursor-pointer"
                onClick={() => toggleExpand(i)}
              >
                <span>{f.label}</span>
                {expanded[i] ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expanded[i] && (
                <div className="p-4 space-y-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        {f.columns.map((c) => (
                          <th key={c} className="p-2 text-left">
                            {c}
                          </th>
                        ))}
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fieldData[i].map((row, idx) => (
                        <tr key={idx} className="border-b">
                          {f.columns.map((c) => (
                            <td key={c} className="p-2">
                              <input
                                className="border p-2 rounded w-full"
                                value={row[c] || ""}
                                onChange={(e) =>
                                  handleChange(i, idx, c, e.target.value)
                                }
                              />
                            </td>
                          ))}
                          <td className="flex gap-4 p-2">
                            <button
                              onClick={() => handleMoveRow(i, idx, -1)}
                              className="text-blue-500 hover:cursor-pointer ml-2"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveRow(i, idx, 1)}
                              className="text-blue-500 hover:cursor-pointer ml-2"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => handleDeleteRow(i, idx)}
                              className="text-red-500 hover:cursor-pointer ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <button onClick={() => handleAddRow(i)} className="bg-[#262262] text-white px-4 py-[8px] rounded-md flex items-center gap-1 active:scale-90 transition-transform duration-100">
                      <Plus size={16} className="mr-1" /> Add Row
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="text-right">
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>

          {/* {confirmDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-sm">
                <p className="text-lg mb-4 font-medium text-gray-700">
                  Are you sure you want to delete this row from{" "}
                  <strong>{FIELD_TYPES[confirmDelete.i].label}</strong>?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={confirmDeleteRow}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )} */}
        </>
      )}

      {activeTab === "System configuration" && <SystemConfigPage />}
      {activeTab === "Resource management" && <ResourceManagement />}
      {activeTab === "Gateway settings" && <GateWaySettings />}
      {activeTab === "Param settings" && <ParamSettings />}
      {activeTab === "KeyTool" && <KeyTool />}
    </div>
  );
}

