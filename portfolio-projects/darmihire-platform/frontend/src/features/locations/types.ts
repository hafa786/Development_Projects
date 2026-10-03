export type Location = {
  address: string;
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  timezone: string | null;
  remote: boolean;
};

export type CreateLocationRequest = {
  name: string;
  city?: string | null;
  country?: string | null;
  timezone?: string | null;
  remote: boolean;
};

export type UpdateLocationRequest = {
  name: string;
  city?: string | null;
  country?: string | null;
  timezone?: string | null;
  remote: boolean;
};