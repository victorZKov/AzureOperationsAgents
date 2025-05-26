using Microsoft.Azure.Functions.Worker.Http;

namespace AzureOperationsAgents.Core.Helpers;

using System.Text.Json;
using System.Text;

public static class JwtUtils
{
    public static string? GetSubFromAuthorizationHeader(HttpRequestData req)
    {
        if (!req.Headers.TryGetValues("Authorization", out var authHeaders))
            return null;

        var bearer = authHeaders.FirstOrDefault();
        if (bearer == null || !bearer.StartsWith("Bearer "))
            return null;

        var token = bearer.Substring("Bearer ".Length);

        var parts = token.Split('.');
        if (parts.Length != 3)
            return null;

        var payload = parts[1];
        payload = PadBase64(payload);

        try
        {
            var json = Encoding.UTF8.GetString(Convert.FromBase64String(payload));
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("sub", out var subElement))
                return subElement.GetString();
        }
        catch
        {
            // Logging or handling optional
        }

        return null;
    }

    private static string PadBase64(string base64)
    {
        return base64.PadRight(base64.Length + (4 - base64.Length % 4) % 4, '=');
    }
}