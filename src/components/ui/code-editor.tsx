"use client"

import { useEffect, useRef } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
}

export default function CodeEditor({ value, onChange, language, height = "200px" }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab" && document.activeElement === editorRef.current) {
          e.preventDefault()
          const start = editorRef.current.selectionStart
          const end = editorRef.current.selectionEnd

          // Insert tab at cursor position
          const newValue = value.substring(0, start) + "  " + value.substring(end)
          onChange(newValue)

          // Move cursor after the inserted tab
          setTimeout(() => {
            if (editorRef.current) {
              editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2
            }
          }, 0)
        }
      }

      document.addEventListener("keydown", handleTabKey)
      return () => document.removeEventListener("keydown", handleTabKey)
    }
  }, [value, onChange])

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
