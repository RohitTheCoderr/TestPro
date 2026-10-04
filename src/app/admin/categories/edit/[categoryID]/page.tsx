"use client";

import CategoryForm from "@/components/adminReleted/categoryForm/categoryForm";
import { SingleCategoryResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function EditCategoryPage() {
  const params = useParams<{ categoryID: string }>();
  const categoryID = params.categoryID;

  const {
    data: category,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["admin-category", categoryID],
    enabled: Boolean(categoryID),
    queryFn: async () => {
      const response = await apiClient.get<SingleCategoryResponse>(
        `/admin/category/${categoryID}`,
      );
      return response.data.category;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load category.",
      );
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return (
      <p role="alert" className="text-center text-red-600">
        {error instanceof Error ? error.message : "Unable to load category."}
      </p>
    );
  }
  if (!category) return <p>Category not found.</p>;
  return <CategoryForm category={category} />;
}

export default EditCategoryPage;
