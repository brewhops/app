import { Moment } from 'moment';

export type KeyAccessor = {
  [key: string]: any;
}

export type Employee = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  phone: string;
  admin: boolean;
};

export type Tank = {
  id?: number | string;
  name: string;
  status: string;
  in_use: boolean;
  update_user?: number;
};

export type Action = {
  id: number;
  name: string;
  description: string;
  classname: string;
};

export type Recipe = {
  id?: number;
  name: string;
  airplane_code: string;
  yeast: number;
  instructions: Ingredient[];
  update_user?: number;
};

export type Ingredient = {
  ingredient: string;
  ratio: string;
};

export type Batch = {
  id?: string | number;
  name: string;
  generation: number;
  volume: number;
  bright: number;
  recipe_id: number;
  tank_id?: string | number;
  started_on?: string;
  completed_on?: string;
  update_user?: number;
};

export type Task = {
    id?: number;
    added_on?: string | Moment;
    completed_on?: string | Moment;
    assigned?: boolean;
    batch_id: number;
    action_id: number;
    exception_reason?: string;
    employee_id?: number;
    update_user?: number;
};

export type Version = KeyAccessor & {
  id?: number;
  sg: number;
  ph: number;
  abv: number;
  temperature: number;
  pressure: number;
  measured_on?: string | Moment;
  completed?: boolean;
  batch_id?: number;
};

export type BrewhopsCookie = {
  id: string;
  username: string;
  admin: boolean;
  token: string;
};

export type ActionUpdate = {
  action: {
    id: string | number | undefined;
    completed: boolean;
    assigned: boolean;
    employee: {
      id: string | number;
    };
  };
};

export type BatchUpdateOrCreate = Batch & Version;
