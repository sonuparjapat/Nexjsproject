// /types/index.ts

export interface Country {
  id: number;
  name: string;
}

export interface Profession {
  id: number;
  name: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  country_id: string;
  profession_id: string;
}