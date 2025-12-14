import React from "react";
import { Outlet } from "react-router";

function BaseLayout({ children }) {
  return (
    <div>
      {children} <Outlet />
    </div>
  );
}

export default BaseLayout;






