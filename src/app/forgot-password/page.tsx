"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../api/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Digite um email válido.")
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Um email de redefinição foi enviado!")
      setError(null)
    } catch (error: any) {
      console.error("Erro ao enviar email de redefinição:", error)
      setError("Erro ao enviar email. Verifique se o email está correto.")
    }
  }

  return (
    <form onSubmit={handleForgotPassword} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive the reset link.</CardDescription>
          {error && <div className="text-red-500 mt-4">Error: {error}</div>}
          {message && <p className="text-green-500 mt-4">{message}</p>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <Button type="submit" className="w-full">
            Send reset link
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
