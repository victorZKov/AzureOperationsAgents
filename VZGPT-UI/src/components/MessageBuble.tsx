type Props = {
    sender: "user" | "assistant";
    text: string;
};

export default function MessageBubble({ sender, text }: Props) {
    const isUser = sender === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
            <div
                className={`rounded-lg px-4 py-2 max-w-[75%] ${
                    isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
            >
                {text}
            </div>
        </div>
    );
}
