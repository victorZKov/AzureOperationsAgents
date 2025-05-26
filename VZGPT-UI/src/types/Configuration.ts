// Configuration.ts - TypeScript interface for the UserConfiguration model
export interface UserConfiguration {
    Id: number;
    UserId: string;
    
    // OpenAI Configuration
    OpenAIKey?: string;
    OpenAIEndpoint?: string;
    OpenAIModel?: string;
    
    // Ollama Configuration
    OllamaServer?: string;
    OllamaModel?: string;
    
    // Serper Configuration
    SerperApiKey?: string;
    SerperApiEndpoint?: string;
    
    // Metadata
    CreatedAt: string;
    UpdatedAt: string;
    IsActive: boolean;
    IsDefault: boolean;
}

