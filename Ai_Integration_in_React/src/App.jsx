import React, { useState, useEffect, useContext, createContext, useRef } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = localStorage.getItem('chatHistory');
            return savedMessages ? JSON.parse(savedMessages) : [];
        } catch (error) {
            console.error("Failed to parse chat history from localStorage", error);
            return [];
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }, [messages]);

    const sendMessage = async (userInput) => {
        if (!userInput.trim()) return;

        const userMessage = { role: 'user', text: userInput, id: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const apiKey=process.env.REACT_APP_GEMINI_API_KEY;
            const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));
            
            const payload = {
                contents: [
                    ...history,
                    {
                        role: 'user',
                        parts: [{ text: userInput }]
                    }
                ]
            };

            const response = await fetch(`${apiUrl}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!assistantResponse) {
                throw new Error("Received an invalid response structure from the API.");
            }

            const assistantMessage = { role: 'assistant', text: assistantResponse, id: Date.now() + 1 };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (err) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        messages,
        loading,
        error,
        sendMessage,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser
        ? 'bg-blue-600 text-white self-end'
        : 'bg-gray-200 text-gray-800 self-start';
    const alignmentClasses = isUser ? 'flex-row-reverse' : 'flex-row';

    return (
        <div className={`flex items-end gap-2 my-2 ${alignmentClasses}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isUser ? 'bg-blue-400' : 'bg-gray-400'}`}>
                {isUser ? 'U' : 'AI'}
            </div>
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl px-4 py-2 ${bubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};

const ChatWindow = () => {
    const { messages, loading, error } = useContext(ChatContext);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {loading && <TypingIndicator />}
                {error && <ErrorMessage message={error} />}
                <div ref={scrollRef} />
            </div>
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex items-end gap-2 my-2 flex-row">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-gray-400">AI</div>
        <div className="max-w-xs md:max-w-md rounded-2xl px-4 py-3 bg-gray-200 text-gray-800 self-start">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="my-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
        <strong>Error:</strong> {message}
    </div>
);

const ChatInput = () => {
    const [inputValue, setInputValue] = useState('');
    const { sendMessage, loading } = useContext(ChatContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    aria-label="Chat input"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={loading}
                    aria-label="Send message"
                    className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
};

export default function App() {
    return (
        <ChatProvider>
            <div className="flex flex-col h-screen font-sans bg-white antialiased">
                 <header className="bg-gray-800 text-white p-4 text-center shadow-md">
                    <h1 className="text-xl font-bold">React Gemini Chat</h1>
                </header>
                <ChatWindow />
                <ChatInput />
            </div>
        </ChatProvider>
    );
}

