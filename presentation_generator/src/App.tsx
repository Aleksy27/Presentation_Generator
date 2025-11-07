import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          ...messages.map((m) => ({ role: "user", content: m })),
          { role: "user", content: input },
        ],
      }),
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;
    setMessages([...messages, input, reply]);
    setInput("");
  };

  return (
    <div className="p-4">
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Napisz wiadomość..."
      />
      <button onClick={sendMessage}>Wyślij</button>
    </div>
  );
}

export default App;
