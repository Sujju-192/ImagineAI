import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Fixed to the left */}
      <div className="fixed left-0 top-0 h-full z-1000">
        <Sidebar />
      </div>

      {/* Main Content Area (Pushes content to the right) */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100 ml-[80px] md:ml-[250px]">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
