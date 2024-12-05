import { Employee } from "@/interfaces";
import http from "@/utils/http";

export interface ListEmployeeResponse {
  status: boolean;
  message: string;
  employees?: Employee[];
  count?: number;
}

// Define the type for department-specific routes
export type DepartmentRoute = 
    'all'
  | 'hr' 
  | 'finance' 
  | 'operations' 
  | 'management' 
  | 'technical';

const useEmployeeService = () => {
  // Generic method to fetch employees by department
  const listEmployees = async (
    department: DepartmentRoute,
    pageNumber?: string,
    keyword?: string
  ): Promise<ListEmployeeResponse> => {
    // Mapping of departments to their specific routes
    const departmentRoutes: Record<DepartmentRoute, string> = {
      all:'/api/employee/all',
      hr: '/api/employee/hr',
      finance: '/api/employee/finance',
      operations: '/api/employee/operations',
      management: '/api/employee/management',
      technical: '/api/employee/technical'
    };

    // Validate department
    if (!departmentRoutes[department]) {
      return {
        status: false,
        message: `Invalid department: ${department}`
      };
    }

    const props = {
      pageNumber,
      keyword
    };

    try {
      const { body } = await http().post(departmentRoutes[department], props, false);
      return {
        status: body.status,
        message: body.message,
        employees: body.data.employees,
        count: body.data.employeeCount,
      };
    } catch (error) {
      return {
        status: false,
        message: `Failed to list employees in ${department} department...Try again!`,
      };
    }
  };


  return {
    listEmployees,
  };
};

export default useEmployeeService;