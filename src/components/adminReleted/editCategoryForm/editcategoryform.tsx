"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, CategoryResponse } from "@/Interfaces";
import { motion } from "framer-motion";
import { Tag, Link2, FileText, Info, Save, ArrowLeft } from "lucide-react";

import InputField from "@/components/shared/inputField";
import TextAreaField from "@/components/shared/textareaField";
import { apiClient } from "@/lib/API/apiClient";
import { details } from "framer-motion/client";

interface EditCategoryFormProps {
  category?: Category;
}
export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    details: category?.categoryDetails?.details || "",
    otherdetails: category?.categoryDetails?.otherdetails || "",
    status: category?.status ?? true,
  });

  const [formError, setFormError] = useState({
    name: "",
    // slug: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormError({
      ...formError,
      [name]: "",
    });
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updatecategoryHandle = async (payload: Category) => {
    try {
      setLoading(true);
      const res = await apiClient.patch<CategoryResponse>(
        "/admin/category/update",
        payload,
      );
      if (res) {
        router.push("/admin/categories");
      }
    } catch (err: any) {
      console.error(" eroororor", err);
      setError(err?.message || "Failed to Update category");
    } finally {
      setLoading(false);
    }
  };

  const CreatecategoryHandle = async (payload: Category) => {
    try {
      setLoading(true);
      const res = await apiClient.post<CategoryResponse>(
        "/admin/category/create",
        payload,
      );
      if (res) {
        router.push("/admin/categories");
      }
    } catch (err: any) {
      console.error(" eroororor", err);
      setError(err?.message || "Failed to create new categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const ErrorsObj = {
      name: "",
      // slug: "",
      details: "",
    };
    let hasError = false;

    if (!formData.name) {
      ErrorsObj.name = "Please Enter Category Name";
      hasError = true;
    }
    if (!formData.details) {
      ErrorsObj.details = "Please Enter Category Details";
      hasError = true;
    }

    setFormError(ErrorsObj);

    if (hasError) {
      return;
    }

    const payload = {
      categoryID: category?.categoryID,
      name: formData.name,
      slug: formData.name,
      categoryDetails: {
        details: formData.details,
        otherdetails: formData.otherdetails,
      },
      status: formData.status,
    };
    if (!payload) {
      return;
    }

    if (payload.categoryID) {
      updatecategoryHandle(payload);
    }
    if (!category?.categoryID) {
      CreatecategoryHandle(payload);
    }
  };

  if (loading) return <p>Loading...!</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className=" mx-auto rounded-2xl bg-white dark:bg-zinc-900
                 shadow-lg border border-zinc-200 dark:border-zinc-800
                 p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
            {category ? "Edit Category" : "Create new Category"}
          </h2>
          <p className="text-sm text-zinc-500">
            Manage category details and status
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-zinc-600
                     hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Name */}
      <InputField
        icon={<Tag size={18} />}
        label="Category Name"
        formError={formError.name}
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter category name"
      />
      {/* Details */}
      <TextAreaField
        icon={<FileText size={18} />}
        label="Details"
        formError={formError.details}
        name="details"
        value={formData.details}
        onChange={handleChange}
        placeholder="Write category description..."
      />

      {/* Other Details */}
      <InputField
        icon={<Info size={18} />}
        label="Other Details"
        name="otherdetails"
        value={formData.otherdetails}
        onChange={handleChange}
        placeholder="Optional information"
      />

      {/* Status Toggle */}
      <div
        className="flex items-center justify-between rounded-xl border
                      border-zinc-200 dark:border-zinc-800
                      bg-zinc-50 dark:bg-zinc-950 p-4"
      >
        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Active Status
          </p>
          <p className="text-xs text-zinc-500">
            Enable or disable this category
          </p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div
            className="w-11 h-6 bg-zinc-300 peer-checked:bg-blue-600
                          rounded-full transition-all"
          />
          <div
            className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full
                          transition-transform peer-checked:translate-x-5"
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
        <button
          type="submit"
          className={`inline-flex items-center gap-2 rounded-lg
                    px-6 py-2 text-white
                      transition ${category ? " bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          <Save size={16} />

          {category ? "Update Category" : "Create Category"}
        </button>
      </div>
    </motion.form>
  );
}
