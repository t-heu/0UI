"use client"

import { useEffect, useRef } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  // language: string
  height?: string
}

export default function CodeEditor({ value, onChange, height = "200px" }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (editorRef.current && e.key === "Tab" && document.activeElement === editorRef.current) {
        e.preventDefault();
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
  
        // Insere dois espaços no cursor
        const newValue = value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);
  
        // Move o cursor após os espaços inseridos
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
          }
        }, 0);
      }
    };
  
    document.addEventListener("keydown", handleTabKey);
    
    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [value, onChange]);

  return (
    <textarea
      ref={editorRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full font-mono text-sm p-4 bg-background border-0 focus:ring-0 focus:outline-none"
      style={{
        height,
        resize: "none",
        whiteSpace: "pre",
        overflowWrap: "normal",
        overflowX: "auto",
      }}
      spellCheck="false"
    />
  )
}
