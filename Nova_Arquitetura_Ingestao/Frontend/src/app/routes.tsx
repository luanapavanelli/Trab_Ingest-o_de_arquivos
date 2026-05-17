import React from 'react';
import { createBrowserRouter, Outlet } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";

const Root = () => {
  return (
    <div className="w-full h-screen bg-neutral-950 font-sans text-gray-200">
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Projects },
      { path: "projetos/:id", Component: Dashboard },
    ],
  },
]);
