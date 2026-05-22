"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("TEST");

  return (
    <main style={{ minHeight: "100vh", background: "black", padding: 40 }}>
      <button
        type="button"
        onClick={() => setText("TIKLANDI")}
        onTouchStart={() => setText("TOUCH ÇALIŞTI")}
        style={{
          background: "white",
          color: "black",
          padding: 20,
          fontSize: 20,
          position: "fixed",
          top: 40,
          left: 40,
          zIndex: 999999999,
        }}
      >
        {text}
      </button>
    </main>
  );
}