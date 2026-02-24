"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const QUICK_REPLIES = [
    "What rooms are available?",
    "What are your check-in times?",
    "Do you offer airport pickup?",
    "What's included in breakfast?",
];

const INITIAL_MESSAGE: Message = {
    id: "init",
    role: "assistant",
    content:
        "Ayubowan! 🌴 Welcome to Loga Guest House. I'm here to help you plan your perfect Sri Lanka stay. How can I assist you today?",
    timestamp: new Date(),
};

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Rule-based FAQ bot (replace with OpenAI call in production)
            const reply = await getFAQResponse(text.toLowerCase());
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center",
                    "bg-ocean shadow-luxury-md hover:bg-ocean-light hover:shadow-luxury-lg hover:scale-105",
                    "transition-all duration-200"
                )}
                aria-label="Chat with us"
            >
                {isOpen ? (
                    <X size={18} className="text-white" />
                ) : (
                    <MessageCircle size={18} className="text-white" />
                )}
            </button>

            {/* Chat window */}
            <div
                className={cn(
                    "fixed bottom-40 right-6 z-50 w-[340px] max-w-[calc(100vw-48px)] rounded-3xl shadow-luxury-lg bg-white border border-coconut-darker",
                    "flex flex-col overflow-hidden",
                    "transition-all duration-300 origin-bottom-right",
                    isOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-90 pointer-events-none"
                )}
                style={{ maxHeight: "480px" }}
            >
                {/* Header */}
                <div className="bg-gradient-tropical p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center">
                        <Bot size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-sans font-medium text-sm text-white">Loga Assistant</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                            <span className="font-sans text-xs text-white/70">Always online</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "200px", maxHeight: "280px" }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] px-3.5 py-2.5 rounded-2xl font-sans text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-ocean text-white rounded-br-sm"
                                        : "bg-coconut text-charcoal rounded-bl-sm"
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-coconut rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-warmgray/50 animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
                    {QUICK_REPLIES.slice(0, 2).map((q) => (
                        <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="shrink-0 text-xs font-sans text-ocean bg-ocean/8 border border-ocean/20 rounded-full px-3 py-1 hover:bg-ocean/15 transition-colors duration-150"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                    className="flex gap-2 p-3 border-t border-coconut-darker"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 font-sans text-sm bg-coconut rounded-xl px-3 py-2 text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-sand/40"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="w-9 h-9 rounded-xl bg-ocean flex items-center justify-center text-white disabled:opacity-40 hover:bg-ocean-light transition-colors duration-150 shrink-0"
                    >
                        <Send size={15} />
                    </button>
                </form>
            </div>
        </>
    );
}

// Simple rule-based FAQ responses
async function getFAQResponse(text: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    if (text.includes("check-in") || text.includes("checkin")) {
        return "Our check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in is subject to availability. Late checkout (until 3 PM) can be arranged for a small fee. 🕐";
    }
    if (text.includes("pickup") || text.includes("airport") || text.includes("transfer")) {
        return "Yes! We offer private airport transfers from Bandaranaike International Airport. The cost is Rs. 8,500 (~$28 USD) for an air-conditioned vehicle. Book this as an add-on during checkout. ✈️";
    }
    if (text.includes("breakfast") || text.includes("food") || text.includes("meal")) {
        return "We serve a delicious full Sri Lankan breakfast including hoppers, string hoppers, fresh tropical fruits, eggs, and Ceylon tea. Breakfast is an optional add-on at Rs. 2,500 per couple. 🥞";
    }
    if (text.includes("wifi") || text.includes("internet")) {
        return "We have high-speed 100 Mbps fiber WiFi throughout the property — perfect for digital nomads! Password provided at check-in. 📶";
    }
    if (text.includes("room") || text.includes("available") || text.includes("book")) {
        return "We have 4 room types: Standard, Deluxe, Family, and Suite — all with AC, hot water, and beautiful tropical views. Visit our rooms page to see availability and book online! 🛏️";
    }
    if (text.includes("cancel") || text.includes("refund")) {
        return "Free cancellation up to 48 hours before check-in. Within 48 hours, the first night is non-refundable. Contact us directly for special circumstances. 📋";
    }
    if (text.includes("payment") || text.includes("pay") || text.includes("price")) {
        return "We accept credit/debit cards (Stripe), bank transfer, and local PayHere gateway. You can pay a 30% deposit to secure your booking and the remaining amount at check-in. 💳";
    }
    if (text.includes("pool") || text.includes("swim")) {
        return "We have a beautiful freshwater swimming pool surrounded by tropical gardens, open from 7 AM to 9 PM. 🏊";
    }
    if (text.includes("ayurveda") || text.includes("massage") || text.includes("spa")) {
        return "We offer traditional Ayurvedic treatments including oil massages, herbal steam baths, and wellness packages. A 60-minute session is Rs. 6,000 (~$20 USD). Book in advance! 🌿";
    }

    return "Thank you for your question! For personalized assistance, please contact us directly via WhatsApp or email. Our team will be happy to help you plan the perfect Sri Lanka stay! 🌴\n\nWhatsApp: +94 77 123 4567\nEmail: hello@logaguesthouse.lk";
}
