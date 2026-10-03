export type Department = {
  id: string;
  name: string;
  description: string | null;
};

export type CreateDepartmentRequest = {
  name: string;
  description?: string | null;
};

export type UpdateDepartmentRequest = {
  name: string;
  description?: string | null;
};