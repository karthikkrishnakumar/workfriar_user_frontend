"use client";

import React from "react";
import { Space } from "antd";
import { useRouter } from "next/navigation";
import { Employee } from "@/interfaces";
import Table, { ColumnType } from "@/themes/components/table/table";
import Avatar from "@/themes/components/avatar/avatar";
import Icons from "@/themes/images/icons/icons";
import DropdownMenu from "@/themes/components/dropdown-menu/dropdown-menu";

interface EmployeeTableProps {
  data: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data }) => {
  const router = useRouter();

  const handleMenuClick = (key: string, record: Employee) => {
    if (key === "details") {
      router.push(`organization/employee-details/1`); //use ${record.id} for actual implementation 
    }
  };

  const columns: ColumnType[] = [
    {
      title: "Employee name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Employee) => (
        <Space size={16}>
          <Avatar initial={record.initial} />
          {text}
        </Space>
      ),
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Reporting Manager",
      dataIndex: "reportingManager",
      key: "reportingManager",
    },
    {
      key: "actions",
      render: (text: string, record: Employee) => (
        <DropdownMenu
          menuItems={[
            {
              key: "details",
              label: "Details",
              onClick: () => handleMenuClick("details", record),
            },
            
          ]}
          icon={Icons.threeDots}
        />
      ),
    },
  ];

  return (
    <div style={{ marginTop: '56px' }}>
      <Table
        columns={columns}
        dataSource={data}
        loading={false}
      />
    </div>
  );
};

export default EmployeeTable;
