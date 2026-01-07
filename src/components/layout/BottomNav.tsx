import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils"; // shadcn utility

export function BottomNav() {
  const navItems = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Learn", icon: "school", path: "/learn" },
    { label: "Rank", icon: "leaderboard", path: "/leaderboard" },
    { label: "Profile", icon: "person", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[1200px] bg-white/95 dark:bg-background/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around items-center pt-3 pb-safe z-40 left-1/2 -translate-x-1/2 pb-4">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 cursor-pointer group w-16 transition-colors",
              isActive ? "text-primary" : "text-gray-400 dark:text-gray-500 hover:text-primary"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  "rounded-full px-4 py-1 transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "group-hover:bg-gray-50 dark:group-hover:bg-gray-800"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[24px] transition-colors",
                    isActive && "material-symbols-filled"
                  )}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
