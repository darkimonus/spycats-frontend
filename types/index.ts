export type SpyCat = {
  id: number;
  name: string;
  experience: number; // 0-15 per requirement
  breed: string;
  salary: number;
};

export type SpyCatCreateInput = {
  name: string;
  experience: number;
  breed: string;
  salary: number;
};

