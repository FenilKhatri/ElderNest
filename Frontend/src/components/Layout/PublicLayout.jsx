import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-3 md:p-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
