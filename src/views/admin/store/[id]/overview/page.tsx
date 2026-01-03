"use client";

import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Home,
  Settings,
  PieChart as PieIcon,
} from "lucide-react";

const barData = [
  { date: "06-30", Succeeded: 1, Refresh: 1 },
  { date: "07-01", Succeeded: 0, Refresh: 0 },
  { date: "07-02", Succeeded: 0, Refresh: 0 },
  { date: "07-03", Succeeded: 0, Refresh: 0 },
  { date: "07-04", Succeeded: 0, Refresh: 0 },
  { date: "Yesterday", Succeeded: 0, Refresh: 0 },
  { date: "Today", Succeeded: 0, Refresh: 0 },
];

const pieData = [
  { name: "Succeeded", value: 100 },
  { name: "Failed", value: 0 },
];

const COLORS = ["#8884d8", "#ff6b6b"];

export default function StoreOverview() {
  const { id } = useParams();
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    const storesJson = localStorage.getItem("stores");
    const stores = storesJson ? JSON.parse(storesJson) : [];
    const matched = stores.find((s: any) => s.id === id);
    setStore(matched);
  }, [id]);

  // if (store) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-gray-500">
  //       No store found for ID: {id}
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6b60ec] text-white p-6 space-y-6">
        <h1 className="text-xl font-bold">Store Dashboard</h1>
        <nav className="space-y-4 text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <Home size={18} /> Store Overview
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <LayoutDashboard size={18} /> Store Data
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <PieIcon size={18} /> Store Template
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:underline">
            <Settings size={18} /> Settings
          </div>
        </nav>
        <div className="absolute bottom-4 left-6 text-xs">Version: 5.21.2</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="text-sm text-gray-500 mb-4">
          Store Management &gt;{" "}
          <span className="text-black font-semibold">{store?.name}</span> &gt; Store Overview
        </div>
        <h2 className="text-2xl font-bold mb-6">Store Overview</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard
            title="Gateway"
            online={0}
            offline={1}
            fromColor="from-pink-300"
            toColor="to-indigo-400"
            fillPercent="50%"
          />
          <SummaryCard
            title="ESL"
            online={0}
            offline={9}
            fromColor="from-sky-300"
            toColor="to-blue-500"
            fillPercent="100%"
          />
          <SummaryCard
            title="Refresh"
            online={1}
            offline={0}
            fromColor="from-green-300"
            toColor="to-emerald-400"
            fillPercent="50%"
          />
          <SummaryCard
            title="Battery level"
            online={9}
            offline={0}
            fromColor="from-orange-300"
            toColor="to-orange-400"
            fillPercent="100%"
            labels={["Normal", "Low battery"]}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">
              ESL status in the last week
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Succeeded" fill="#5b9df9" />
                <Bar dataKey="Refresh" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-end mt-2 text-sm">
              <span className="mr-4">
                <span className="inline-block w-3 h-3 bg-[#5b9df9] rounded-full mr-1" />
                Succeeded/times
              </span>
              <span>
                <span className="inline-block w-3 h-3 bg-[#f87171] rounded-full mr-1" />
                Refresh/times
              </span>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Success rate</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={70}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-3xl font-semibold mt-2">
              100.00%
            </div>
            <div className="text-center text-sm text-gray-500">Succeeded</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  online,
  offline,
  fromColor,
  toColor,
  fillPercent,
  labels = ["Online", "Offline"],
}: {
  title: string;
  online: number;
  offline: number;
  fromColor: string;
  toColor: string;
  fillPercent: string;
  labels?: [string, string] | string[];
}) {
  return (
    <div
      className={`bg-gradient-to-r ${fromColor} ${toColor} p-4 rounded-xl text-white`}
    >
      <h4 className="text-lg font-semibold">{title}</h4>
      <div className="flex justify-between mt-2">
        <span>
          {labels[0]} <span className="ml-1">{online}</span>
        </span>
        <span>
          {labels[1]} <span className="ml-1">{offline}</span>
        </span>
      </div>
      <div className="h-1 bg-white/40 mt-3 rounded-full">
        <div
          className="h-1 bg-white rounded-full"
          style={{ width: fillPercent }}
        />
      </div>
    </div>
  );
}
