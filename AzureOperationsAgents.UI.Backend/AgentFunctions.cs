public class AgentFunctions
{
    public static void ConfigureAgentFunctions(IServiceCollection services)
    {
        services.AddSingleton<AgentRepository>();
        services.AddSingleton<AgentService>();
    }
}