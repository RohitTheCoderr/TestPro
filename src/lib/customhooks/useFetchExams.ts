import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/API/apiClient";

export function useFetchExams(categoryId?: string) {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/category/${categoryId}/exams`);
      setExams(res.data?.exams || []);
    } catch (err: any) {
      setError(err.message || "Error fetching exams");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams };
}
