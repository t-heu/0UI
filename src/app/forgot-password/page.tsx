"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../api/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setError(t("errors.email-invalid"))
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("A reset email has been sent!")
      setError(null)
    } catch (error) {
      console.error("Error ", error)
      setError(t("errors.email-send"))
    }
  }

  return (
    <form onSubmit={handleForgotPassword} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("interface.forgot_password")}</CardTitle>
          <CardDescription>{t("interface.forgot_password_description")}</CardDescription>
          {error && <div className="text-red-500 mt-4">Error: {error}</div>}
          {message && <p className="text-green-500 mt-4">{message}</p>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("interface.email_label")}</Label>
              <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <Button type="submit" className="w-full">
              {t("interface.send_reset_link_button")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
