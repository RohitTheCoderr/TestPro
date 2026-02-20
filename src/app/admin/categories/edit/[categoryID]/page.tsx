"use client";

import CategoryForm from "@/components/adminReleted/categoryForm/categoryForm";
import { SingleCategoryResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useAppSelector } from "@/lib/redux/hooks";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function EditCategoryPage() {
  const params = useParams<{ categoryID: string }>();
  const categoryID = params.categoryID;

  const categoryFromStore = useAppSelector((state) =>
    state.categories.categoriesList.find(
      (cat) => cat.categoryID === categoryID,
    ),
  );
  const [category, setCategory] = useState(categoryFromStore);

  useEffect(() => {
    if (!categoryFromStore && categoryID) {
      const fetchData = async () => {
        try {
          const data = await apiClient.get<SingleCategoryResponse>(
            `/admin/category/${categoryID}`,
          );
          setCategory(data.data.category);
        } catch (error: unknown) {
          let message = "An unexpected error occurred.";

          if (error instanceof Error) {
            message = error.message;
          }

          console.error("Error fetching categories:", message);
          alert(message);
        }
      };
      fetchData();
    }
  }, [categoryFromStore, categoryID]);

  if (!category) return <p>Loading...</p>;
  return <CategoryForm category={category} />;
}

export default EditCategoryPage;
