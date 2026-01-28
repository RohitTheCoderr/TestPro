"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { apiClient } from "@/lib/API/apiClient";
import { Category, CategoryResponse } from "@/Interfaces";
import { setCategoriesList } from "@/lib/redux/slices/forAdminSlice/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categoriesList = useAppSelector(
    (state) => state.categories.categoriesList,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<CategoryResponse>("/admin/category/list");
      dispatch(setCategoriesList(res?.data?.categories));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-semibold">Categories</h2>

        <Link
          href="/admin/categories/create"
          className="bg-green-600 text-white max-md:text-[14px] px-4 py-1  md:px-4 md:py-2 rounded hover:bg-green-700"
        >
          + Add Category
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left ">Details</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : categoriesList?.length > 0 ? (
              categoriesList.map((cat: Category, index: number) => (
                <tr key={cat.categoryID} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium min-w-40 ">
                    {cat.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 min-w-40">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs max-sm:line-clamp-2 overflow-hidden">
                    {cat.categoryDetails?.details}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        cat.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/categories/edit/${cat.categoryID}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriesPage;
