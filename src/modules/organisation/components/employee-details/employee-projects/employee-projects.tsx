import React from 'react';
import { Project } from '@/interfaces';
import Table, { ColumnType } from '@/themes/components/table/table';
import Avatar from '@/themes/components/avatar/avatar';
import { Space } from 'antd';

interface EmployeeProjectsProps {
  projects: Project[];
  loading?: boolean;
}

export const EmployeeProjects: React.FC<EmployeeProjectsProps> = ({ 
  projects, 
  loading = false 
}) => {
  const columns: ColumnType[] = [
    {
      title: 'Projects',
      key: 'project',
      render: (_, record) => (
          <Space size={16}>
          <Avatar initial={record.projectInitial} />
          {record.projectName}
        </Space>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Start and end date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Project lead',
      dataIndex: 'projectLead',
      key: 'projectLead',
    },
  ];

  return (
    <div style={{ marginTop: '36px' }}>
      <Table
      columns={columns}
      dataSource={projects}
      loading={loading}
    />
    
    </div>
  );
};