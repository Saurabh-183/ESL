"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { Pencil, Plus, Search, Trash2, Loader2 } from "lucide-react";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Inter } from "next/font/google";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
});

type Store = {
    id: string;
    storeNumber: string;
    storeName: string;
    storeAddress: string;
    storeImage: string;
    isActive: boolean;
};

export default function StoreManager() {
    const API_URL = process.env.NEXT_PUBLIC_DEV_APP;
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [form, setForm] = useState({
        id: "",
        storeNumber: "",
        storeName: "",
        storeAddress: "",
        file: null as File | null,
        storeImage: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [editStore, setEditStore] = useState<Store | null>(null);
    const [deleteStore, setDeleteStore] = useState<Store | null>(null);
    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("blob:") || path.startsWith("http")) return path;
        const formattedPath = path.replace(/\\/g, "/");
        const cleanPath = formattedPath.startsWith("/") ? formattedPath : `/${formattedPath}`;
        return `${API_URL}${cleanPath}`;
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/login", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!data?.token) {
                    toast.error("Please login again to continue");
                    router.push("/login");
                    return;
                }
                setToken(data.token);
                setIsAuthLoaded(true);
            } catch (err) {
                console.error("Auth check error:", err);
                toast.error("Session expired. Please login again.");
                router.push("/login");
            }
        };
        checkAuth();
    }, [router]);
    const fetchStores = async () => {
        if (!token) return;
        try {
            const res = await fetch(
                `${API_URL}/store/store-list${statusFilter ? `?status=${statusFilter}` : ""}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            console.log("Store Data:", data.data);
            if (data.status === 200) {
                setStores(data.data || []);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchStores();
    }, [token, statusFilter]);
    const handleSave = async () => {
        if (!token)
            return;
        if (!form.storeName || !form.storeNumber) {
            toast.error("Store name & number required");
            return;
        }
        const formData = new FormData();
        formData.append("storeNumber", form.storeNumber);
        formData.append("storeName", form.storeName);
        formData.append("storeAddress", form.storeAddress);
        if (form.file) {
            formData.append("file", form.file);
        }
        const isEdit = Boolean(editStore);
        if (isEdit) formData.append("storeId", String(form.id));
        const url = isEdit
            ? `${API_URL}/store/update-store`
            : `${API_URL}/store/create-store`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (data.status === 200) {
                toast.success(isEdit ? "Store Updated!" : "Store Created!");
                setShowModal(false);
                fetchStores();
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (err) {
            console.log(err);
            toast.error("API Error");
        }
    };
    const confirmDelete = async () => {
        if (!deleteStore || !token) return;

        try {
            const res = await fetch(
                `${API_URL}/store/delete-store?id=${deleteStore.id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (data.status === 200) {
                toast.success("Store Deleted");
                await fetchStores();
            }

            setDeleteStore(null);
        } catch (err) {
            console.log(err);
        }
    };
    const toggleStatus = async (store: Store) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/store/open-close-store`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storeId: store.id,
                    isActive: !store.isActive,
                }),
            });

            const data = await res.json();

            if (data.status === 200) {
                toast.success("Status Updated");
                await fetchStores();
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Handle image upload - Creates a local preview URL
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);

        setForm((prev) => ({
            ...prev,
            file: file,
            storeImage: objectUrl
        }));
    };

    // Edit handler
    const handleEdit = (store: Store) => {
        setEditStore(store);
        setForm({
            id: store.id,
            storeNumber: store.storeNumber,
            storeName: store.storeName,
            storeAddress: store.storeAddress,
            file: null,
            storeImage: getImageUrl(store.storeImage),
        });
        setShowModal(true);
    };

    const filteredStores = stores.filter((s) =>
        s.storeName.toLowerCase().includes(search.toLowerCase())
    );

    if (!isAuthLoaded) {
        return (
            <div className="p-10 flex justify-center text-2xl">
                {" "}
                Loading
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div
            className={`max-w-5xl mx-auto bg-white p-4 border rounded-lg ${inter.variable}`}
        >
            {/* Header Filters & Search */}
            <div className="flex justify-between mb-4 flex-wrap gap-4">
                <FormControl size="small" sx={{ width: 175 }}>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        sx={{ borderRadius: "8px", height: "40px" }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="close">Closed</MenuItem>
                    </Select>
                </FormControl>

                <div className="flex gap-2">
                    <div className="flex items-center gap-2 border px-3 py-[8px] rounded">
                        <Search className="w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search store..."
                            className="outline-none bg-transparent"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditStore(null);
                            setForm({
                                id: "",
                                storeNumber: "",
                                storeName: "",
                                storeAddress: "",
                                file: null,
                                storeImage: "",
                            });
                            setShowModal(true);
                        }}
                        className="bg-[#262262] text-white px-4 py-[8px] rounded flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Store
                    </button>
                </div>
            </div>

            {/* Store Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredStores.map((store) => (
                    // <div key={store.id} className="border p-4 rounded">
                    <div
                        // key={store.id}
                        // onClick={() => router.push(`/admin/storeManagement/${store.id}`)}
                        className="border p-4 rounded cursor-pointer hover:shadow-lg transition"
                    >
                        {store.storeImage ? (
                            <img
                                key={store.id}
                                onClick={() => router.push(`/admin/storemanagement/${store.id}/overview`)}
                                src={getImageUrl(store.storeImage)}
                                alt={store.storeName}
                                className="h-60 w-full object-cover rounded"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : (
                            <div className="h-60 w-full text-sm bg-gray-100 rounded flex items-center justify-center text-gray-500">
                                {store.storeName}
                            </div>
                        )}
                        {/* Fallback div if image exists but fails to load (handled by onError) */}
                        <div className="hidden h-60 w-full text-sm bg-gray-100 rounded items-center justify-center text-gray-500">
                            {/* Image not found */}
                            <Image
                                width={200}
                                height={200}
                                src="/images/10607573.jpg"
                                alt="Store is here"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        <h2 className="text-base font-semibold mt-2">{store.storeName}</h2>
                        <p className="text-sm text-gray-600">
                            Store No: {store.storeNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                            Address: {store.storeAddress}
                        </p>

                        <div className="flex justify-between mt-3 items-center">
                            {/* Toggle */}
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={store.isActive}
                                    onChange={() => toggleStatus(store)}
                                    className="sr-only peer"
                                />
                                <div className="w-[26px] h-[14px] bg-gray-200 border-gray-300 border rounded-full peer peer-checked:bg-green-600 peer-checked:border-green-700 peer-checked:border after:content-[''] after:absolute after:top-[4px] after:left-[1px] after:bg-white  after:h-3 after:w-3 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                                <span className="ml-3 text-sm font-medium">
                                    {store.isActive ? "Open" : "Closed"}
                                </span>
                            </label>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(store)}
                                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteStore(store)}
                                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editStore ? "Edit Store" : "Add Store"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="hover:cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M18 6l-12 12" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <label htmlFor="storeNumber"> Store Number</label>
                                <input
                                    type="text"
                                    placeholder="Store Number"
                                    value={form.storeNumber}
                                    onChange={(e) =>
                                        setForm({ ...form, storeNumber: e.target.value })
                                    }
                                    className="border w-full p-2 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="storeName">Store Name</label>
                                <input
                                    type="text"
                                    placeholder="Store Name"
                                    value={form.storeName}
                                    onChange={(e) =>
                                        setForm({ ...form, storeName: e.target.value })
                                    }
                                    className="border w-full p-2 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="storeAddress">Address</label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={form.storeAddress}
                                    onChange={(e) =>
                                        setForm({ ...form, storeAddress: e.target.value })
                                    }
                                    className="border w-full p-2 rounded"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">
                                    Store Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:bg-violet-50 file:text-gray-500 hover:file:bg-gray-300"
                                />

                                {form.storeImage && (
                                    <img
                                        src={form.storeImage}
                                        alt="preview"
                                        className="h-40 w-full object-cover mt-2 rounded border"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-600"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#262262] text-white rounded hover:bg-opacity-90"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteStore && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded text-center max-w-sm shadow-lg">
                        <h2 className="font-semibold mb-4 text-lg">
                            Delete store "{deleteStore.storeName}"?
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteStore(null)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}