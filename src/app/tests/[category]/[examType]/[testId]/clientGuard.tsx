"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ClientGuardProps {
  children: React.ReactNode;
}

function ClientGuard({ children }: ClientGuardProps) {
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);
  const rehydrated = useAppSelector((state: any) => state._persist?.rehydrated);

  useEffect(() => {
    if (!token || !user) {
      if (!rehydrated) return;
      alert("please login/Register before starting Test");
      router.replace("/auth");
      return;
    }
  }, [token, user, rehydrated]);
  1;
  return <>{children}</>;
}
export default ClientGuard;
