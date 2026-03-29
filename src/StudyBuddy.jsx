import { useEffect, useRef, useState } from "react";
import s from "./StudyBuddy.module.scss";

const SCRIPT = [
  {
    from: "user",
    text: "Why can't I understand integration by parts? I've read it 6 times.",
  },
  {
    from: "ai",
    text: "Okay, forget the formula for a second. Think of it like this: you've got two things multiplied together, and you're trying to integrate their product. The trick is splitting them into two people — one who differentiates, one who integrates. The LIATE rule tells you who does what...",
  },
  { from: "user", text: "ohhh. so it's like... teamwork?" },
  {
    from: "ai",
    text: "Exactly! Now want me to throw you 5 practice problems? We'll start easy and build up.",
  },
];

const CHAR_MS = 42; // ms per character typed

export default function StudyBuddyChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [cycle, setCycle] = useState(0);
  const msgRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const tos = [];
    const go = (fn, delay) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      tos.push(t);
    };

    // Reset for this cycle
    setMessages([]);
    setInputText("");
    setAiTyping(false);

    let t = 600; // initial pause before first keystroke

    for (const msg of SCRIPT) {
      if (msg.from === "user") {
        // Type each character into the input
        for (let i = 1; i <= msg.text.length; i++) {
          const slice = msg.text.slice(0, i);
          go(() => setInputText(slice), t + i * CHAR_MS);
        }
        t += msg.text.length * CHAR_MS + 320;
        // "Send" — clear input, add message to chat
        go(() => {
          setInputText("");
          setMessages((m) => [...m, msg]);
        }, t);
        t += 520;
      } else {
        // AI picks up typing indicator
        go(() => setAiTyping(true), t);
        const aiDelay = Math.min(1100 + msg.text.length * 9, 2800);
        t += aiDelay;
        // AI "sends" response
        go(() => {
          setAiTyping(false);
          setMessages((m) => [...m, msg]);
        }, t);
        t += 750;
      }
    }

    // Pause, then restart the loop
    t += 2400;
    go(() => setCycle((c) => c + 1), t);

    return () => {
      cancelled = true;
      tos.forEach(clearTimeout);
    };
  }, [cycle]);

  // Auto-scroll messages area
  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages, aiTyping]);

  return (
    <div className={s.chat} aria-label="AI Study Buddy demo chat">
      <div className={s.chatHeader}>
        <div className={s.aiAv} aria-hidden="true">
          🧠
        </div>
        <div>
          <div className={s.aiName}>Tuki AI</div>
          <div className={s.aiStatus}>● Online · Always</div>
        </div>
      </div>

      <div className={s.messages} ref={msgRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${s.msg} ${msg.from === "user" ? s.user : s.ai}`}
          >
            {msg.text}
          </div>
        ))}
        {aiTyping && (
          <div className={`${s.msg} ${s.ai} ${s.typing}`} aria-label="Thinking…">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className={s.chatInput}>
        <div className={s.fakeInput} aria-hidden="true">
          {inputText ? (
            <>
              <span className={s.typedText}>{inputText}</span>
              <span className={s.caret} />
            </>
          ) : (
            <>
              <span className={s.placeholder}>Ask anything about your studies…</span>
              <span className={s.caret} />
            </>
          )}
        </div>
        <button
          className={`${s.send}${inputText ? ` ${s.sendActive}` : ""}`}
          aria-label="Send"
          type="button"
        >
          →
        </button>
      </div>
    </div>
  );
}
