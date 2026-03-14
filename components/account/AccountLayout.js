import Navbar from "@/components/Navbar";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#FDFBF7] py-10">
        <div className="max-w-7xl h-full mx-auto px-4 flex flex-col lg:flex-row gap-6">
          <AccountSidebar className="self-stretch" />
          <main className="flex-1 bg-white rounded-xl shadow-sm border border-[#F0EBE3] p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
