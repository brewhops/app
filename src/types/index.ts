import { Moment } from 'moment';

export type Employee = {
  username: string;
};

export type Tank = {
  id?: number | string;
  name: string;
  status: string;
  in_use: boolean;
};

export type Action = {
  id: number;
  name: string;
  description: string;
};

export type Recipe = {
  id: number;
  name: string;
  airplane_code: string;
  yeast: number;
  instructions: object;
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
};

export type Task = {
  id?: number;
  added_on?: string;
  completed_on?: string;
  assigned?: boolean;
  batch_id: number;
  action_id: number;
  employee_id?: number;
};

export type Version = {
  id?: number;
  sg: number;
  ph: number;
  abv: number;
  temperature: number;
  pressure: number;
  measured_on?: string | Moment;
  completed?: false | Moment;
  batch_id?: number;
};

export type BrewhopsCookie = {
  id: string | number;
  username: string;
  admin: boolean;
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

export type BatchUpdateOrCreate = ActionUpdate & Batch & Version;
