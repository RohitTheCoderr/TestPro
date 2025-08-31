
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <h1 className="text-2xl font-bold text-blue-600">TestPro</h1>
        <nav className="space-x-6">
          <a href="/" className="text-black hover:text-blue-500">Home</a>
          <a href="/tests" className="text-black hover:text-blue-500">Tests</a>
          <a href="/pricing" className="text-black hover:text-blue-500">Pricing</a>
          <a
            href="/auth"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
        </nav>
      </header>
  );
};

export default Header;
