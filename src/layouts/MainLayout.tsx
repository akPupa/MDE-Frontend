import { Header } from "@components/MainLayout/Header";
import { Sidebar } from "@components/MainLayout/SideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
export function MainLayout() {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen overflow-x-hidden bg-green-50/30">
      <Sidebar open={open} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-x-hidden`}
      >
        <Header open={open} setOpen={setOpen} />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}