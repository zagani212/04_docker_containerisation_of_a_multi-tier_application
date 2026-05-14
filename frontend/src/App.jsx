import { useCallback, useEffect, useState } from "react";

const api = (path, options) =>
  fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

export default function App() {
  const [health, setHealth] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [h, m] = await Promise.all([
        api("/health").then((r) => r.json()),
        api("/messages").then((r) => r.json()),
      ]);
      setHealth(h);
      setMessages(Array.isArray(m) ? m : []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    try {
      const r = await api("/messages", {
        method: "POST",
        body: JSON.stringify({ body: text.trim() }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || r.statusText);
      }
      setText("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="wrap">
      <header>
        <h1>Three-tier stack</h1>
        <p className="sub">
          React (nginx) → Node API → MySQL, wired with Docker Compose.
        </p>
      </header>

      <section className="card">
        <h2>API health</h2>
        {health ? (
          <pre className="mono">{JSON.stringify(health, null, 2)}</pre>
        ) : (
          <p>Loading…</p>
        )}
      </section>

      <section className="card">
        <h2>Messages</h2>
        <form onSubmit={send} className="row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="New message"
            maxLength={512}
          />
          <button type="submit">Send</button>
        </form>
        <ul className="list">
          {messages.map((msg) => (
            <li key={msg.id}>
              <span className="body">{msg.body}</span>
              <span className="meta">{msg.created_at}</span>
            </li>
          ))}
        </ul>
      </section>

      {error && <p className="err">{error}</p>}
    </div>
  );
}
