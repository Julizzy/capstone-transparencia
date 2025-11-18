"use client";

import { useState } from "react";
import { SendHorizonal, MessageCircle } from "lucide-react";

export default function Chatbot({ datasetId }: { datasetId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/chat/h2yr-zfb2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: userMsg }),
      });

      const data = await res.json();
      console.log("RESPUESTA DEL BACKEND:", data);

      const respuestaIA =
        data.historial?.find((entry: any) => entry.rol === "asistente")?.contenido
        ?? "No pude procesar la respuesta.";
        
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.respuesta ?? "No pude procesar la respuesta." }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al consultar la IA." }
      ]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-[#5111a6] hover:bg-[#3a0b78] text-white p-4 rounded-full shadow-xl transition"
      >
        <MessageCircle size={26} />
      </button>

      {/* PANEL DEL CHAT */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[480px] bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-[#5111a6] text-white rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold">Asistente del Dataset</h3>
            <button onClick={() => setOpen(false)} className="text-white">✕</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm w-fit max-w-[90%] ${
                  msg.sender === "user"
                    ? "bg-[#5111a6] text-white ml-auto"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-sm">El asistente está escribiendo...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Pregúntame algo..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-[#5111a6] hover:bg-[#3a0b78] text-white p-2 rounded-lg"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
