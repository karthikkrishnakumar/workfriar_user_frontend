export interface Employee {
  id?:string
  name: string;
  initial?: string;// Initials for the avatar
  email: string;
  department: string;
  role: string;
  reportingManager: string;
  location?: string;
  phoneNumber?: string;
  status?: string;
  avatar?: string;
}

export interface Project {
  key: string;
  projectInitial: string;
  projectName: string;
  client: string;
  date: string;
  projectLead: string;
}