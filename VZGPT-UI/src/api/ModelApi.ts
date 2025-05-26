import { AIModel } from "../types/AIModel";
import { apiFetchJson } from "../services/ApiServices";

// Get all AI models
export const getAIModels = async (): Promise<AIModel[]> => {
    try {
        return await apiFetchJson<AIModel[]>("/api/models/", "GET");
    } catch (error) {
        console.error("Error fetching AI models:", error);
        throw error;
    }
};

