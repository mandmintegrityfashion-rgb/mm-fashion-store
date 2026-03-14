// components/AccountSidebar.js
import Link from "next/link";
import { useRouter } from "next/router";

const mainLinks = [
    { label: "Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Inbox", href: "/account/inbox" },
  { label: "Pending Reviews", href: "/account/reviews" },
  { label: "Voucher", href: "/account/voucher" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Recently Viewed", href: "/account/recentlyViewed" },
];

const settingsLinks = [
  { label: "Account Management", href: "/account/settings" },
  { label: "Address Book", href: "/account/addresses" },
  { label: "Newsletter Preferences", href: "/account/newsletter" },
  { label: "Close Account", href: "/account/close" },
];

export default function AccountSidebar({ logout }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <aside className="w-full lg:w-1/4 bg-white rounded-3xl shadow-md p-4 space-y-4 border border-gray-100">
      <h2 className="text-md font-extrabold text-gray-900 mb-6 tracking-wide">
        Account
      </h2>

      <ul className="space-y-3">
        {mainLinks.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className={`block px-4 py-2 rounded-2xl border cursor-pointer font-medium transition-all duration-300 ${
                isActive(href)
                  ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                  : "border-amber-400 hover:bg-yellow-50 hover:text-yellow-700"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-gray-200 my-4" />

      <ul className="space-y-3">
        {settingsLinks.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className={`block px-4 py-2 rounded-2xl border cursor-pointer font-medium transition-all duration-300 ${
                isActive(href)
                  ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                  : "border-amber-400 hover:bg-yellow-50 hover:text-yellow-700"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={logout}
        className="w-full mt-6 px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-2xl font-semibold hover:bg-red-50 hover:text-red-700 transition-all duration-300"
      >
        Logout
      </button>
    </aside>
  );
}
