"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ModuleHeader from "../module-header/module-header";
import { openModal } from "@/redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import Icons from "@/themes/images/icons/icons";

const ModuleHeaderWrapper = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();


  // Define the pages and their corresponding data
  const pages = [

    { title: "Dashboard", path: "/dashboard", backButtonNeeded: false, actionButton: null},
    { title: "Timesheet", path: "/time-sheet", backButtonNeeded: false, actionButton: null},
    { title: "Profile", path: "/profile", backButtonNeeded: true, actionButton: null,  },
    { title: "Notifications", path: "/notifications", backButtonNeeded: true, actionButton: null},
    { title: "Holidays", path: "/holidays", backButtonNeeded: true, actionButton: { label: "Add Holidays", icon: Icons.plusLight, modalType: "holidayModal" }},
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
  const actionButton = currentPage?.actionButton;

  // Function to open the modal based on the page's modalType
  const openModalBasedOnPage = () => {

    if (actionButton?.modalType) {
      dispatch(openModal(actionButton.modalType)); // Dispatch the modal based on the modalType in the pages data
    }
  };

  return (
        <ModuleHeader title={title} isBackButtonNeeded={isBackButtonNeeded} />

  );
};

export default ModuleHeaderWrapper;
