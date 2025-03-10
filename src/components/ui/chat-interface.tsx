"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Code, User, Send, Loader2 } from "lucide-react"

import generateCode from "../../app/utils/generateCode";

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  code?: {
    ejs?: string
    css?: string
  }
}

type ChatInterfaceProps = {
  onCodeGenerated: (ejs: string, css: string) => void
}

export default function ChatInterface({ onCodeGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your EJS & CSS generator assistant. What kind of template would you like me to create for you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    // Adiciona a mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    // Chama a IA para gerar o código EJS e CSS
    const generatedCode = await generateCode(input);
  
    // Divide o código gerado em EJS e CSS (supondo que o resultado de `generateCode` seja um objeto)
    const { ejs, css } = JSON.parse(generatedCode);
    // Gera a resposta do assistente com o código EJS e CSS
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "I've created an EJS template and CSS for you based on your request. Here's what I've generated:",
      code: {
        ejs,
        css,
      },
    };
  
    // Atualiza as mensagens com a resposta da IA
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleUseCode = (ejs: string, css: string) => {
    onCodeGenerated(ejs, css)
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8">
                {message.role === "user" ? <User className="h-5 w-5" /> : <Code className="h-5 w-5" />}
              </Avatar>
              <div>
                <Card className={`p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                  <p>{message.content}</p>
                </Card>

                {message.code && (
                  <div className="mt-2">
                    {message.code.ejs && (
                      <div className="mb-2">
                        <div className="bg-muted text-xs p-1 rounded-t-md">EJS Template</div>
                        <pre className="bg-muted p-2 rounded-b-md overflow-x-auto text-xs">
                          <code>{message.code.ejs}</code>
                        </pre>
                      </div>
                    )}

                    {message.code.css && (
                      <div className="mb-2">
                        <div className="bg-muted text-xs p-1 rounded-t-md">CSS</div>
                        <pre className="bg-muted p-2 rounded-b-md overflow-x-auto text-xs">
                          <code>{message.code.css}</code>
                        </pre>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800 mt-2"
                      onClick={() =>
                        message.code &&
                        message.code.ejs &&
                        message.code.css &&
                        handleUseCode(message.code.ejs, message.code.css)
                      }
                    >
                      Use This Code
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <Code className="h-5 w-5" />
              </Avatar>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Generating code...</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          placeholder="Ask for an EJS template (e.g., 'Create a login form')"
          disabled={isLoading}
        />
        <Button className="bg-black text-white hover:bg-gray-800" type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
