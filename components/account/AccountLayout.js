import Navbar from "@/components/Navbar";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content wrapper - fills remaining height after navbar */}
      <div className="flex-1 bg-gray-50 py-10">
        <div className="max-w-7xl h-full mx-auto px-4 flex flex-col lg:flex-row gap-6">
          <AccountSidebar className="self-stretch" />
          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg shadow p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
