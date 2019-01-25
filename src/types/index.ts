export type Tank = {
    id: number,
    name: string,
    status: string,
    in_use: boolean
}

export type Action = {
    id: number,
    name: string,
    description: string
}

export type Recipe = {
    id: number,
    name: string,
    airplane_code: string,
    yeast: number,
    instructions: object
}

export type Batch = {
    id: number,
    name: string,
    generation: number,
    volume: number,
    bright: number,
    recipe_id: number,
    tank_id: number,
    started_on: string,
    completed_on: string
}