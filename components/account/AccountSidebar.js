// components/AccountSidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { FiUser, FiPackage, FiMail, FiStar, FiTag, FiHeart, FiClock, FiSettings, FiMapPin, FiBell, FiXCircle, FiLogOut } from "react-icons/fi";

const mainLinks = [
  { label: "Account", href: "/account", icon: FiUser },
  { label: "Orders", href: "/account/orders", icon: FiPackage },
  { label: "Inbox", href: "/account/inbox", icon: FiMail },
  { label: "Pending Reviews", href: "/account/reviews", icon: FiStar },
  { label: "Voucher", href: "/account/voucher", icon: FiTag },
  { label: "Wishlist", href: "/account/wishlist", icon: FiHeart },
  { label: "Recently Viewed", href: "/account/recentlyViewed", icon: FiClock },
];

const settingsLinks = [
  { label: "Account Management", href: "/account/settings", icon: FiSettings },
  { label: "Address Book", href: "/account/addresses", icon: FiMapPin },
  { label: "Newsletter Preferences", href: "/account/newsletter", icon: FiBell },
  { label: "Close Account", href: "/account/close", icon: FiXCircle },
];

export default function AccountSidebar({ logout }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm border border-blue-200 p-5 space-y-4">
      <h2 className="text-sm font-bold text-[#1F2D3D] uppercase tracking-wider mb-5">
        My Account
      </h2>

      <ul className="space-y-1">
        {mainLinks.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? "bg-[#1A5DAB] text-white"
                  : "text-gray-600 hover:bg-[#E6F0FA] hover:text-[#1A5DAB]"
              }`}
            >
              <Icon size={16} className={isActive(href) ? "text-[#4C9EFF]" : ""} />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-blue-200 my-3" />

      <ul className="space-y-1">
        {settingsLinks.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? "bg-[#1A5DAB] text-white"
                  : "text-gray-600 hover:bg-[#E6F0FA] hover:text-[#1A5DAB]"
              }`}
            >
              <Icon size={16} className={isActive(href) ? "text-[#4C9EFF]" : ""} />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={logout}
        className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-2.5 text-red-600 border border-red-300/50 rounded-lg font-medium hover:bg-red-50 transition-all duration-200"
      >
        <FiLogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
