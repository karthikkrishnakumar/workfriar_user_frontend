"use client";

import React from "react";
import { Dropdown as AntDropdown} from "antd";
import styles from "./dropdown-menu.module.scss";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  menuItems: MenuItem[];
  trigger?: ("click" | "hover" | "contextMenu")[]; // Dropdown trigger events
  icon?: React.ReactNode; // Custom icon for the trigger
  wrapperClassName?: string; // Custom class for the trigger wrapper
}

const DropdownMenu: React.FC<DropdownProps> = ({
  menuItems,
  trigger = ["click"],
  icon,
  wrapperClassName = "",
}) => {
  return (
    <AntDropdown
      trigger={trigger}
      menu={{
        items: menuItems.map((item) => ({
          key: item.key,
          label: item.label,
          onClick: item.onClick,
        })),
      }}
    >
      <div className={`${styles.triggerWrapper} ${wrapperClassName}`}>
        {icon}
      </div>
    </AntDropdown>
  );
};

export default DropdownMenu;
