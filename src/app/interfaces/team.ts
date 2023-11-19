import { Project } from "./project";

export interface Team{
    id : string,
    name : string,
    manager : string,
    employees : string[],
    projects : string[],
}

export interface AddTeam{
    name : string,
    manager : string,
    employees : string[],
    projects : AddProject[]
}

interface AddProject{
    employees  :string[],
    name : string,
}