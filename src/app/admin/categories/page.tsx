"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/API/apiClient";
import { Category, CategoryResponse } from "@/Interfaces";
import { setCategoriesList } from "@/lib/redux/slices/forAdminSlice/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import TruncateTextTooltip from "@/components/shared/truncketTooltip";

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
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900">
            <TableHead className="text-start">Category ID</TableHead>
            <TableHead className="text-start">Category Name</TableHead>
            <TableHead className="text-start">Category Details</TableHead>
            <TableHead className="text-start">Other Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow aria-rowspan={5}>
              <TableCell> Loading...</TableCell>
            </TableRow>
          )}
          {categoriesList?.length > 0 &&
            categoriesList.map((cat: Category, index: number) => (
              <TableRow
                key={index}
                className={`${index % 2 != 0 ? "bg-slate-50" : ""}`}
              >
                <TableCell>{cat.categoryID}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell className=" max-w-[800px]">
                  <TruncateTextTooltip
                    text={cat.categoryDetails?.details ?? ""}
                    maxWidth="max-w-[800px]"
                  />{" "}
                </TableCell>
                <TableCell>
                  <TruncateTextTooltip
                    text={cat.categoryDetails?.otherdetails ?? ""}
                    maxWidth="max-w-[800px]"
                  />{" "}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      cat.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cat.status ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/categories/edit/${cat.categoryID}`}
                    className="text-blue-600 flex justify-center items-center"
                  >
                    <Edit />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CategoriesPage;
