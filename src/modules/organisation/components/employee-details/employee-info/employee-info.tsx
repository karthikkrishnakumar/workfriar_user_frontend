import React from 'react';
import styles from './employee-info.module.scss';
import { Employee } from '@/interfaces';
import Avatar from '@/themes/components/avatar/avatar';
import Icons from '@/themes/images/icons/icons';

interface EmployeeInfoProps {
  data: Employee;
}

export const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ data }) => {

  const employeeInfoItems = [
    { label: 'Location', value: data.location },
    { label: 'Phone number', value: data.phoneNumber },
    { label: 'Employee role', value: data.role },
    { label: 'Department', value: data.department },
    { label: 'Reporting Manager', value: data.reportingManager },
    { label: 'Status', value: data.status },
  ];
  
  return (
    <div className={styles.employeeInfo}>
      <div className={styles.header}>
        <div className={styles.headerGrid}>

          <Avatar 
            size={80} 
            icon={Icons.userIcon} 
            src={data.avatar}
            className={styles.avatar}
          />

          <div className={styles.field}>
                <div className={styles.label}>Employee name</div>
                <div className={styles.value}>{data.name}</div>
          </div>
              
          <div className={styles.field}>
            <div className={styles.label}>Email address</div>
            <div className={styles.value}>{data.email}</div>
          </div>

        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailsGrid}>
          {employeeInfoItems.map((item, index) => (
            <div key={index} className={styles.field}>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
