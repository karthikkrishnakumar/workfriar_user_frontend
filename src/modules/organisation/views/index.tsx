"use client";
import React, { useState, useEffect } from "react";
import EmployeeTable from "../components/list-employees/list-employees";
import Tabs from "@/themes/components/tabs/tabs";
import useEmployeeService, { DepartmentRoute } from "../services/employee-service";
import { employees as EMPLOYEES_CONSTANT, organisationTabs } from "../constants";
import { Employee } from "@/interfaces";
import HeaderUnderline from "@/themes/components/header-underline";

const OrganisationView = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [employees, setEmployees] = useState<Employee[]>([]);//use this when implemetation
  
  //remove if global loading available 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employeeService = useEmployeeService();

  // Fetch employees based on the active tab
  const fetchEmployees = async (department: string) => {
    setIsLoading(true);
    setError(null);

    try {

      const response = await employeeService.listEmployees(
        department as DepartmentRoute
      );

      if (response.status) {
        setEmployees(response.employees || []);
      } else {
        setError(response.message || "Failed to fetch employees");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch employees when tab changes
  useEffect(() => {
    fetchEmployees(activeTab);
  }, [activeTab]);

  return (
    <>


    <HeaderUnderline>
    <Tabs
        items={organisationTabs}
        activeKey={activeTab}
        onChange={setActiveTab}
    />
    </HeaderUnderline>
    <EmployeeTable 
        data={EMPLOYEES_CONSTANT}
    />
  
    </>
  );
};

export default OrganisationView;