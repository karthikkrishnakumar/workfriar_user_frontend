import React, { Ref } from 'react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from "antd";
import styles from "./tabs.module.scss";

interface TabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

interface TabsProps extends Omit<AntTabsProps, 'items'> {
  items: TabItem[];
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ 
  items, 
  className, 
  ...restProps 
}) => {
  const tabItems = items.map(item => ({
    key: item.key,
    label: item.label,
    children: item.children || null,
  }));

  return (
    <div className={`${styles.tabsWrapper} ${className || ""}`.trim()}>
      <AntTabs
        {...restProps}
        items={tabItems}
        className={styles.tabs}
      />
    </div>
  );
};

export default Tabs;