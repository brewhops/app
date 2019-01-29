export type Tank = {
  id: number;
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
  id: string;
  name: string;
  airplane_code: string;
  yeast: number;
  instructions: object;
};

export type Batch = {
  id?: number;
  name: string;
  generation: number;
  volume: number;
  bright: number;
  recipe_id: number;
  tank_id: number;
  started_on: string;
  completed_on: string;
};

export type Task = {
    id: number;
    added_on: string;
    completed_on: string;
    assigned: boolean;
    batch_id: number;
    action_id: number;
    employee_id: number;
};

export type Version = {
    id: number;
    sg: number;
    ph: number;
    abv: number;
    temperature: number;
    pressure: number;
    measured_on: string;
    completed: false;
    batch_id: number;
};
