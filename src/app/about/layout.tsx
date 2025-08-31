import Link from "next/link";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">About Us</h1>
      <nav className="mt-4 w-full m-auto flex justify-end">
        <ul className="flex space-x-4">
          {/* <li><Link href="/about">overview</Link></li> */}
          <li><Link href="/about/team">Team</Link></li>
          <li><Link href="/about/history">History</Link></li>
          <li><Link href="/about/mission">Mission</Link></li>
        </ul>
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
