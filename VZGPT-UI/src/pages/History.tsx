import { Link } from "react-router-dom";

export default function History() {
    const mockConversations = [
        { id: "1", title: "Consulta sobre facturación" },
        { id: "2", title: "Asistente legal" },
        { id: "3", title: "Ideas de negocio" },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Historial de conversaciones</h2>
            <ul className="space-y-2">
                {mockConversations.map((conv) => (
                    <li key={conv.id}>
                        <Link
                            to={`/chat/${conv.id}`}
                            className="block p-2 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            {conv.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
