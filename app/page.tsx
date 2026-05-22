"use client";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "black", padding: 40 }}>
      <button
        type="button"
        onClick={() => alert("CLICK CALISTI")}
        onTouchStart={() => alert("TOUCH CALISTI")}
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
        TEST
      </button>
    </main>
  );
}