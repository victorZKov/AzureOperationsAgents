import { apiFetchJson } from "../services/ApiServices";
import {Project} from "../types/Project";


export async function getProjects(): Promise<Project[]> {
    return await apiFetchJson("/api/projects", "GET", undefined); 
}

export async function createProject(name: string): Promise<Project> {
    return await apiFetchJson("/api/projects", "POST", { name }); 
}