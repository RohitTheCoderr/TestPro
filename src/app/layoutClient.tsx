"use client";

import { usePathname } from "next/navigation";

export default function LayoutClient({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader =  pathname.startsWith("/tests") && pathname.includes("/attempt")|| pathname.startsWith("/start-test") ;

  return (
    <>
      {!hideHeader && header}
      {children}
      {!hideHeader && footer}
    </>
  );
}
