import React from "react";

type TimehelperProps = {
  data: string;
};

export function Timehelper({ data }: TimehelperProps) {
  if (!data) {
    return null;
  }
  return (
    <>
      {new Date(data).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  );
}
