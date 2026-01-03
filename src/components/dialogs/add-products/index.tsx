import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ProductDialog = ({
  open,
  setOpen,
  productList,
  setProductList,
}: {
  open: boolean;
  setOpen: any;
  productList: any;
  setProductList: any;
}) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);

  const [token, setToken] = useState("");

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await fetch("/api/login", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setToken(result.token);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const filteredItems = useMemo(() => {
    return data.filter((item: any) => {
      return item.productTitle.toLowerCase().includes(query.toLowerCase());
    });
  }, [data, query]);

  const handleClose = () => {
    setOpen(false);
  };

  const API_URL = process.env.NEXT_PUBLIC_DEV_APP;

  useEffect(() => {
    if (token !== "") fetchProductList();
  }, [token]);

  useEffect(() => {
    if (productList) {
      setSelectedProducts(productList);
    }
  }, [open]);

  const fetchProductList = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/product-list`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.status === 200 || response.status === 201) {
        setData(result.productData);
      } else {
        console.error("Failed to fetch Category:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProductList = (id: string, name: string, mediaUrl: string) => {
    setSelectedProducts((prev: any[]) => {
      const exists = prev.some((item) => item.id === id);

      if (exists) {
        // Checkbox was unchecked – remove it
        return prev.filter((item) => item.id !== id);
      } else {
        // Checkbox was checked – add it
        return [...prev, { id, productTitle: name, mediaUrl }];
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="alert-dialog-title" className="bg-[#F1F1F7] py-3">
        Add Product
      </DialogTitle>
      <DialogContent className="py-4 px-0">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="default-search"
          className="block w-[40%] px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg  mb-4 mx-6 "
          placeholder="Search products"
          required
        />
        <DialogContentText id="alert-dialog-description">
          {filteredItems.map((ele: any, index) => {
            console.log("ele", ele.id);
            return (
              <div
                key={index}
                className={`flex justify-between border-t ${data.length - 1 === index && "border-b"} px-6 py-4`}
              >
                {/* Render product data */}
                <div className="flex gap-4 items-center">
                  {
                    <img
                      src={`${API_URL}/uploads/${ele.media[0]?.mediaUrl}`}
                      className="w-12 h-12 object-contain"
                      alt="product-img"
                    />
                  }

                  <p>{ele.productTitle}</p>
                </div>

                <input
                  type="checkbox"
                  checked={selectedProducts.some(
                    (item: any) => item.id === ele.id
                  )}
                  onChange={() =>
                    handleProductList(
                      ele.id,
                      ele.productTitle,
                      ele.media[0]?.mediaUrl
                    )
                  }
                />
              </div>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="tonal"
          color="secondary"
          type="reset"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="button"
          onClick={() => {
            setProductList(selectedProducts);
            setSelectedProducts([]);
            handleClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
