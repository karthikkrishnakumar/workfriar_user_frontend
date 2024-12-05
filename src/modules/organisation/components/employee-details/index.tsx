"use client"

import React, { useState } from 'react';
import { Employee, Project } from '@/interfaces';
import Tabs from '@/themes/components/tabs/tabs';
import { EmployeeInfo } from './employee-info/employee-info';
import { EmployeeProjects } from './employee-projects/employee-projects';

const tabItems = [
  { key: 'employee', label: 'Employee' },
  { key: 'projects', label: 'Employee projects' },
];

const EmployeeDetailsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employee');

  const employeeData:  Employee= {
    name: 'Guruvayurappan G R',
    email: 'guru@gmail.com',
    location: 'India',
    phoneNumber: '+91 9876543210',
    role: 'Project Manager',
    department: 'Management',
    reportingManager: 'Madavan Ramakrishnan',
    status: 'In progress'
  };

  const projectsData: Project[] = [
    {
      key: '1',
      projectInitial: 'D',
      projectName: 'Diamond Lease',
      client: 'Techfriar India',
      date: '11/10/2024 -02/05/2025',
      projectLead: 'Aswina Vinod'
    },
    // ... add more projects
  ];

  return (
    <div>
      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
      <div >
        {activeTab === 'employee' ? (
          <EmployeeInfo data={employeeData} />
        ) : (
          <EmployeeProjects projects={projectsData} />
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailsView;