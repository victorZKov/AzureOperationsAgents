import { UserConfiguration } from "../types/Configuration";
import { apiFetchJson } from "../services/ApiServices";

// Get the current user's configurations
export const getUserConfigurations = async (): Promise<UserConfiguration[]> => {
    try {
        return await apiFetchJson<UserConfiguration[]>("/api/configurations", "GET");
    } catch (error) {
        console.error("Error fetching user configurations:", error);
        throw error;
    }
};

// Get a specific configuration by ID
export const getConfigurationById = async (id: number): Promise<UserConfiguration> => {
    try {
        return await apiFetchJson<UserConfiguration>(`/api/configurations/${id}`, "GET");
    } catch (error) {
        console.error(`Error fetching configuration with ID ${id}:`, error);
        throw error;
    }
};

// Update a configuration
export const updateConfiguration = async (id: number, configuration: Partial<UserConfiguration>): Promise<UserConfiguration> => {
    try {
        return await apiFetchJson<UserConfiguration>(`/api/configurations/${id}`, "PUT", configuration);
    } catch (error) {
        console.error(`Error updating configuration with ID ${id}:`, error);
        throw error;
    }
};

// Create a new configuration
export const createConfiguration = async (configuration: Partial<UserConfiguration>): Promise<UserConfiguration> => {
    try {
        return await apiFetchJson<UserConfiguration>("/api/configurations", "POST", configuration);
    } catch (error) {
        console.error("Error creating configuration:", error);
        throw error;
    }
};

// Set a configuration as default
export const setDefaultConfiguration = async (id: number): Promise<void> => {
    try {
        await apiFetchJson(`/api/configurations/${id}/setDefault`, "POST");
    } catch (error) {
        console.error(`Error setting configuration ${id} as default:`, error);
        throw error;
    }
};

// Delete a configuration
export const deleteConfiguration = async (id: number): Promise<void> => {
    try {
        await apiFetchJson(`/api/configurations/${id}`, "DELETE");
    } catch (error) {
        console.error(`Error deleting configuration ${id}:`, error);
        throw error;
    }
};
