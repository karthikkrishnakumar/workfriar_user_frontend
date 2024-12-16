"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ModuleHeader from "../module-header/module-header";

const ModuleHeaderWrapper = () => {
  const pathname = usePathname();


  // Define the pages and their corresponding data
  const pages = [

    { title: "Dashboard", path: "/dashboard", backButtonNeeded: false, actionButton: null},
    { title: "Timesheet", path: "/time-sheet", backButtonNeeded: false, actionButton: null},
    { title: "Profile", path: "/profile", backButtonNeeded: true, actionButton: null,  },
    { title: "Notifications", path: "/notifications", backButtonNeeded: false, actionButton: null},
    { title: "Holidays", path: "/holidays", backButtonNeeded: true, actionButton: null},
  ];

  // Function to match the dynamic path
  const matchPath = (path: string, dynamicPath: string) => {
    const staticSegments = dynamicPath.split("/").filter((seg) => !seg.startsWith("["));
    return staticSegments.every((seg) => path.includes(seg));
  };


  // Find the matching page based on the current pathname
  const currentPage = pages.find((page) =>
    page.path.includes("[id]") ? matchPath(pathname, page.path) : page.path === pathname
  );

  // Fallback in case no matching page is found
  const title = currentPage?.title ?? "Default Title";
  const isBackButtonNeeded = currentPage?.backButtonNeeded || false;


  return (
        <ModuleHeader title={title} isBackButtonNeeded={isBackButtonNeeded}  actionButton={null} />
  );
};

export default ModuleHeaderWrapper;
