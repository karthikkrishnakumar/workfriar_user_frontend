interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownConfig {
  [key: string]: DropdownItem[] | undefined;
}

export const getDropdownItems = (label: string): DropdownItem[] | undefined => {
  const dropdownConfig: DropdownConfig = {
   
    Settings: [
      {
        label: "Account settings",
        path: "/account-settings",
      },
      {
        label: "Privacy settings",
        path: "/privacy-settings",
      },
    ],
   
  };

  return dropdownConfig[label];
};

// Helper function to determine if a navigation item should be collapsible
export const isCollapsibleItem = (label: string): boolean => {
  return [ "Settings"].includes(label);
};

