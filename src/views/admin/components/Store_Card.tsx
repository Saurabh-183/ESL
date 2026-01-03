"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@mui/material";
import Image from "next/image";

type Store = {
  id: string;
  number: string;
  name: string;
  address: string;
  image: string;
  status: "opened" | "closed";
};

type Props = {
  store: Store | null | undefined;
  onEdit: (store: Store) => void;
  onToggle: (id: string) => void;
  onDelete: (store: Store) => void;
};

export default function StoreCard({
  store,
  onEdit,
  onToggle,
  onDelete,
}: Props) {
  if (!store) return null; // Prevent rendering if store is not available

  return (
    <div className="border rounded-xl shadow-sm p-4 w-full bg-white">
      {/* Image section */}
      <div className="rounded-md overflow-hidden mb-3">
        {store.image ? (
          <Image
            src={store.image}
            alt="Store"
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Store details */}
      <p>
        <strong>Name:</strong> {store.name}
      </p>
      <p>
        <strong>Number:</strong> {store.number}
      </p>
      <p>
        <strong>Address:</strong> {store.address}
      </p>

      {/* Toggle and Actions */}
      <div className="flex items-center justify-between mt-3">
        <Switch
          checked={store.status === "opened"}
          onChange={() => onToggle(store.id)}
        />
        <div className="flex items-center gap-2">
          <Pencil
            className="cursor-pointer text-blue-600"
            onClick={() => onEdit(store)}
          />
          <Trash2
            className="cursor-pointer text-red-500"
            onClick={() => onDelete(store)}
          />
        </div>
      </div>
    </div>
  );
}
