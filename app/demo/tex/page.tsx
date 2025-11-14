"use client";

import React, { useState, useRef } from "react";

interface TypingBoxProps {
  width?: number;
  height?: number;
}

const map: Record<string, string> = {
  "-thumbs_up": "👍",
  "-middle_finger": "🖕",
  "-link": "https://gravadox.dev",
};

export default function TypingBox({ width = 500, height = 60 }: TypingBoxProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (value: string) => {
    let newText = value;
    for (const k in map) {
      newText = newText.split(k).join(map[k]);
    }
    setText(newText);
  };

  return (
    <div
    className="flex items-start justify-center flex-col h-screen"
      style={{
        borderRadius: 6,
        background: "#09090b",
        padding: 10,
        color: "#fff",
        fontFamily: "monospace",
        position: "relative",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Type here..."
        className="w-80 mx-auto"
        style={{
          background: "transparent",
          border: focused ? "2px solid #3f3f46" : "2px solid #27272a",
          outline: "none",
          color: "#fff",
          fontSize: 18,
          padding: "10px",
          fontFamily: "monospace",
        }}
      />

      {/* Test display below */}
      <div className="mx-auto" style={{ marginTop: 10, fontSize: 14, color: "#a1a1aa" }}>
        Test:
        {Object.entries(map).map(([key, val]) => (
          <div key={key}>
            {key} → {val}
          </div>
        ))}
      </div>
    </div>
  );
}
