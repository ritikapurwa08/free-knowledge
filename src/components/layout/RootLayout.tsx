import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function RootLayout() {
  const location = useLocation();

  // List of routes where the Bottom Navigation should be HIDDEN
  const hideNavRoutes = [
    "/quiz/attempt",
    "/admin",
    "/register",
    "/login",

  ];

  const shouldShowNav = !hideNavRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="relative flex h-full min-h-screen w-full max-w-[1200px] flex-col overflow-x-hidden bg-background shadow-2xl">
        <main className="flex-1">
          <Outlet />
        </main>
        {shouldShowNav && <BottomNav />}
      </div>
    </div>
  );
}
