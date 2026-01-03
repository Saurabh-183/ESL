// "use client";

// import React, { useState, useRef } from "react";
// import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import * as XLSX from "xlsx";
// import { Button } from "@/components/ui/Button";
// import "react-toastify/dist/ReactToastify.css";
// import DataChangePage from "../data_change/page";
// import DataDeleteRecordPage from "../data_delete_record/page";
// import GatewayOfflinePage from "../gateway_offline/page";
// import PeopleCountingPage from "../people_counting/page";
// import RefreshGraphStatisticsPage from "../refresh_graph_statistics/page";
// import TempratureHumidityPage from "../temperature_humiditystatistics/page";

// interface FieldType {
//   label: string;
//   columns: string[];
// }
// type FieldRow = { [key: string]: string };

// const TABS = [
//   "Data Change",
//   "Data Delete Record",
//   "Gateway Offline",
//   "People Counting",
//   "Operation Record",
//   "Refresh Graph Statistics",
//   "Temperature Humidity statistics",
// ] as const;

// const FIELD_TYPES: FieldType[] = [
//   { label: "Ordinary field", columns: ["ID", "Type", "Name", "Prefix"] },
//   { label: "Icon field", columns: ["ID", "Name", "Icon Library"] },
//   { label: "Image field", columns: ["ID", "Name"] },
//   { label: "Video field", columns: ["ID", "Name"] },
//   { label: "Carousel field", columns: ["ID", "Name"] },
// ];

// export default function DataFieldsPage() {
//   const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Data Change");
//   const [expanded, setExpanded] = useState<boolean[]>(Array(FIELD_TYPES.length).fill(false));
//   const [fieldData, setFieldData] = useState<FieldRow[][]>(FIELD_TYPES.map(() => []));
//   const inputRefs = useRef<HTMLInputElement[][][]>([]);

//   const toggleExpand = (i: number) => {
//     setExpanded((prev) => {
//       const c = [...prev];
//       c[i] = !c[i];
//       return c;
//     });
//   };

//   const handleAddRow = (i: number) => {
//     const newRow = FIELD_TYPES[i].columns.reduce((a, c) => ({ ...a, [c]: "" }), {} as FieldRow);
//     setFieldData((prev) => {
//       const c = [...prev];
//       c[i] = [...c[i], newRow];
//       return c;
//     });
//     toast.success(`Row added to "${FIELD_TYPES[i].label}"`);
//   };

//   const handleDeleteRow = (i: number, idx: number) => {
//     if (confirm("Are you sure?")) {
//       setFieldData((prev) => {
//         const c = [...prev];
//         c[i] = c[i].filter((_, j) => j !== idx);
//         return c;
//       });
//       toast.success(`Row deleted from "${FIELD_TYPES[i].label}"`);
//     }
//   };

//   const handleMoveRow = (i: number, idx: number, dir: number) => {
//     setFieldData((prev) => {
//       const c = [...prev];
//       const arr = [...c[i]];
//       const t = arr[idx + dir];
//       if (t) {
//         arr[idx + dir] = arr[idx];
//         arr[idx] = t;
//         c[i] = arr;
//         toast.info(`Row moved ${dir > 0 ? "down" : "up"} in "${FIELD_TYPES[i].label}"`);
//       }
//       return c;
//     });
//   };

//   const handleChange = (i: number, idx: number, key: string, v: string) => {
//     setFieldData((prev) => {
//       const c = [...prev];
//       const arr = [...c[i]];
//       arr[idx] = { ...arr[idx], [key]: v };
//       c[i] = arr;
//       return c;
//     });
//   };

//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     i: number,
//     idx: number,
//     colIdx: number
//   ) => {
//     if (e.key === "Tab" || e.key === "Enter") {
//       e.preventDefault();
//       const nextCol = colIdx + 1;
//       const nextRow = idx + (nextCol >= FIELD_TYPES[i].columns.length ? 1 : 0);
//       const finalCol = nextCol % FIELD_TYPES[i].columns.length;
//       const ref = inputRefs.current?.[i]?.[nextRow]?.[finalCol];
//       if (ref) ref.focus();
//     }
//   };

//   const handleConfirm = () => {
//     console.log("Saved data:", fieldData);
//     toast.success("All data fields saved successfully!");
//   };

//   const handleExport = () => {
//     const wb = XLSX.utils.book_new();
//     FIELD_TYPES.forEach((f, i) => {
//       const data = fieldData[i];
//       const sheet = XLSX.utils.json_to_sheet([...data]);
//       XLSX.utils.book_append_sheet(wb, sheet, f.label);
//     });
//     XLSX.writeFile(wb, "datafields.xlsx");
//     toast.success("Data exported to Excel!");
//   };

//   const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       const wb = XLSX.read(reader.result, { type: "binary" });
//       FIELD_TYPES.forEach((f, i) => {
//         const sheet = wb.Sheets[f.label];
//         if (sheet) {
//           const arr = XLSX.utils.sheet_to_json<FieldRow>(sheet);
//           setFieldData((prev) => {
//             const c = [...prev];
//             c[i] = [...c[i], ...arr];
//             return c;
//           });
//         }
//       });
//       toast.success("Data imported from Excel!");
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen text-black">
//       <ToastContainer position="top-right" />

//       <div className="flex space-x-4 border-b mb-6">
//         {TABS.map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveTab(t)}
//             className={`px-4 py-2 rounded-xl hover:bg-gray-300 ${
//               activeTab === t
//                 ? "border-2 border-[#262262] bg-white text-[#262262] font-semibold"
//                 : "text-gray-600"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {activeTab === "Data Change" && (
//         <>
//           {FIELD_TYPES.map((f, i) => (
//             <div key={i} className="bg-gray-100 mb-4 rounded-xl overflow-hidden">
//               <div
//                 className="flex justify-between p-4 cursor-pointer"
//                 onClick={() => toggleExpand(i)}
//               >
//                 <span>{f.label}</span>
//                 {expanded[i] ? <ChevronUp /> : <ChevronDown />}
//               </div>
//               {expanded[i] && (
//                 <div className="p-4 space-y-4">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         {f.columns.map((c) => (
//                           <th key={c} className="p-2 text-left">
//                             {c}
//                           </th>
//                         ))}
//                         <th className="p-2">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {fieldData[i].map((row, idx) => (
//                         <tr key={idx} className="border-b">
//                           {f.columns.map((c, colIdx) => (
//                             <td key={c} className="p-2">
//                               <input
//                                 className="border p-2 rounded w-full"
//                                 value={row[c] || ""}
//                                 onChange={(e) => handleChange(i, idx, c, e.target.value)}
//                                 onKeyDown={(e) => handleKeyDown(e, i, idx, colIdx)}
//                                 ref={(el) => {
//                                   if (!inputRefs.current[i]) inputRefs.current[i] = [];
//                                   if (!inputRefs.current[i][idx]) inputRefs.current[i][idx] = [];
//                                   inputRefs.current[i][idx][colIdx] = el!;
//                                 }}
//                               />
//                             </td>
//                           ))}
//                           <td className="flex gap-4 p-2">
//                             <button
//                               onClick={() => handleMoveRow(i, idx, -1)}
//                               className="text-blue-500"
//                             >
//                               ↑
//                             </button>
//                             <button
//                               onClick={() => handleMoveRow(i, idx, 1)}
//                               className="text-blue-500"
//                             >
//                               ↓
//                             </button>
//                             <button
//                               onClick={() => handleDeleteRow(i, idx)}
//                               className="text-red-500"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div className="flex justify-end">
//                     <Button onClick={() => handleAddRow(i)}>
//                       <Plus size={16} className="mr-1" /> Add Row
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div className="text-right mt-4">
//             <Button onClick={handleConfirm}>Confirm</Button>
//           </div>
//         </>
//       )}

//       {activeTab === "Data Change" && <DataChangePage />}
//       {activeTab === "Data Delete Record" && <DataDeleteRecordPage />}
//       {activeTab === "Gateway Offline" && <GatewayOfflinePage />}
//       {activeTab === "People Counting" && <PeopleCountingPage />}
//       {activeTab === "Refresh Graph Statistics" && <RefreshGraphStatisticsPage />}
//       {activeTab === "Temperature Humidity statistics" && <TempratureHumidityPage />}
//     </div>
//   );
// }











"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/Button";
import DataChangePage from "../data_change/page";
import DataDeleteRecordPage from "../data_delete_record/page";
import GatewayOfflinePage from "../gateway_offline/page";
import PeopleCountingPage from "../people_counting/page";
import RefreshGraphStatisticsPage from "../refresh_graph_statistics/page";
import TempratureHumidityPage from "../temperature_humiditystatistics/page";

interface FieldType {
  label: string;
  columns: string[];
}
type FieldRow = { [key: string]: string };

const TABS = [
  "Data Change",
  "Data Delete Record",
  "Gateway Offline",
  "People Counting",
  "Operation Record",
  "Refresh Graph Statistics",
  "Temperature Humidity statistics",
] as const;

const FIELD_TYPES: FieldType[] = [
  { label: "Ordinary field", columns: ["ID", "Type", "Name", "Prefix"] },
  { label: "Icon field", columns: ["ID", "Name", "Icon Library"] },
  { label: "Image field", columns: ["ID", "Name"] },
  { label: "Video field", columns: ["ID", "Name"] },
  { label: "Carousel field", columns: ["ID", "Name"] },
];

export default function DataFieldsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Data Change");
  const [expanded, setExpanded] = useState<boolean[]>(Array(FIELD_TYPES.length).fill(false));
  const [fieldData, setFieldData] = useState<FieldRow[][]>(FIELD_TYPES.map(() => []));
  const inputRefs = useRef<HTMLInputElement[][][]>([]);

  const toggleExpand = (i: number) => {
    setExpanded((prev) => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  };

  const handleAddRow = (i: number) => {
    const newRow = FIELD_TYPES[i].columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {});
    setFieldData((prev) => {
      const copy = [...prev];
      copy[i] = [...copy[i], newRow];
      return copy;
    });
    toast.success(`Row added to "${FIELD_TYPES[i].label}"`);
  };

  const handleDeleteRow = (i: number, idx: number) => {
    if (confirm("Are you sure you want to delete this row?")) {
      setFieldData((prev) => {
        const copy = [...prev];
        copy[i] = copy[i].filter((_, j) => j !== idx);
        return copy;
      });
      toast.success(`Row deleted from "${FIELD_TYPES[i].label}"`);
    }
  };

  const handleMoveRow = (i: number, idx: number, direction: number) => {
    setFieldData((prev) => {
      const copy = [...prev];
      const rows = [...copy[i]];
      const targetIdx = idx + direction;

      if (targetIdx >= 0 && targetIdx < rows.length) {
        [rows[idx], rows[targetIdx]] = [rows[targetIdx], rows[idx]];
        copy[i] = rows;
        toast.info(`Row moved ${direction > 0 ? "down" : "up"} in "${FIELD_TYPES[i].label}"`);
      }

      return copy;
    });
  };

  const handleChange = (i: number, idx: number, key: string, value: string) => {
    setFieldData((prev) => {
      const copy = [...prev];
      const updatedRow = { ...copy[i][idx], [key]: value };
      copy[i] = [...copy[i]];
      copy[i][idx] = updatedRow;
      return copy;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    idx: number,
    colIdx: number
  ) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextCol = (colIdx + 1) % FIELD_TYPES[i].columns.length;
      const nextRow = colIdx + 1 >= FIELD_TYPES[i].columns.length ? idx + 1 : idx;

      const ref = inputRefs.current?.[i]?.[nextRow]?.[nextCol];
      ref?.focus();
    }
  };

  const handleConfirm = () => {
    console.log("Saved Data:", fieldData);
    toast.success("All data fields saved successfully!");
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    FIELD_TYPES.forEach((field, i) => {
      const sheet = XLSX.utils.json_to_sheet(fieldData[i]);
      XLSX.utils.book_append_sheet(wb, sheet, field.label);
    });
    XLSX.writeFile(wb, "datafields.xlsx");
    toast.success("Data exported to Excel!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const wb = XLSX.read(reader.result, { type: "binary" });
      FIELD_TYPES.forEach((f, i) => {
        const sheet = wb.Sheets[f.label];
        if (sheet) {
          const rows = XLSX.utils.sheet_to_json<FieldRow>(sheet);
          setFieldData((prev) => {
            const copy = [...prev];
            copy[i] = [...copy[i], ...rows];
            return copy;
          });
        }
      });
      toast.success("Data imported from Excel!");
    };
    reader.readAsBinaryString(file);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Data Change":
        return (
          <>
            {FIELD_TYPES.map((field, i) => (
              <div key={i} className="bg-gray-100 mb-4 rounded-xl overflow-hidden">
                <div
                  className="flex justify-between p-4 cursor-pointer"
                  onClick={() => toggleExpand(i)}
                >
                  <span>{field.label}</span>
                  {expanded[i] ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expanded[i] && (
                  <div className="p-4 space-y-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          {field.columns.map((col) => (
                            <th key={col} className="p-2 text-left">
                              {col}
                            </th>
                          ))}
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fieldData[i].map((row, idx) => (
                          <tr key={idx} className="border-b">
                            {field.columns.map((col, colIdx) => (
                              <td key={col} className="p-2">
                                <input
                                  className="border p-2 rounded w-full"
                                  value={row[col] || ""}
                                  onChange={(e) => handleChange(i, idx, col, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(e, i, idx, colIdx)}
                                  ref={(el) => {
                                    if (!inputRefs.current[i]) inputRefs.current[i] = [];
                                    if (!inputRefs.current[i][idx]) inputRefs.current[i][idx] = [];
                                    inputRefs.current[i][idx][colIdx] = el!;
                                  }}
                                />
                              </td>
                            ))}
                            <td className="flex gap-3 p-2">
                              <button onClick={() => handleMoveRow(i, idx, -1)} className="text-blue-500">↑</button>
                              <button onClick={() => handleMoveRow(i, idx, 1)} className="text-blue-500">↓</button>
                              <button onClick={() => handleDeleteRow(i, idx)} className="text-red-500">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-end">
                      <Button onClick={() => handleAddRow(i)} className="bg-[#262262] text-white px-4 py-[8px] rounded-md flex items-center gap-1 active:scale-90 transition-transform duration-100">
                        <Plus size={16} className="mr-1" /> Add Row
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <div className="flex items-center gap-4">
                <input type="file" accept=".xlsx, .xls" onChange={handleImport} />
                <Button onClick={handleExport}>Export</Button>
              </div>
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>

            <div className="mt-6">
              <DataChangePage />
            </div>
          </>
        );

      case "Data Delete Record":
        return <DataDeleteRecordPage />;
      case "Gateway Offline":
        return <GatewayOfflinePage />;
      case "People Counting":
        return <PeopleCountingPage />;
      case "Refresh Graph Statistics":
        return <RefreshGraphStatisticsPage />;
      case "Temperature Humidity statistics":
        return <TempratureHumidityPage />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <ToastContainer position="top-right" />
      {renderTabContent()}

      {/* Tab Menu */}
      <div className="flex space-x-4 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl hover:bg-gray-300 ${
              activeTab === tab
                ? "border-2 border-[#262262] bg-white text-[#262262] font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {/* {renderTabContent()} */}
    </div>
  );
}
