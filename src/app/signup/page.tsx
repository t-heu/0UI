"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

import { ref, database, set, auth } from "../api/firebase";
import { useUser } from "../context/userContext"
import { useTranslation } from 'react-i18next';

export default function SignUpPage() {
  const { user } = useUser()
  const { t } = useTranslation();
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      if (user) router.push("/")
    }, [user, router]);

  function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": t("errors.email_already_in_use"),
      "auth/invalid-email": t('errors.invalid_email'),
      "auth/weak-password": t('errors.password_too_short'),
      "auth/network-request-failed": t("errors.network_error"),
      "auth/operation-not-allowed": t("errors.operation_not_allowed"),
      "auth/too-many-requests": t("errors.too_many_requests")
    }
    
    return errorMessages[errorCode] || t("errors.error_creating_account");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null)

    if (!name.trim() || !email.trim() || !confirmPassword.trim() || !password.trim()) {
      return setError(t("errors.fields_required"))
    }

    if (/\s/.test(name)) {
      return setError(t("errors.username_contains_spaces"))
    }

    if (password.length < 6) {
      return setError(t("errors.password_too_short"))
    }
    
    if (password !== confirmPassword) {
      return setError(t("errors.password_mismatch"));
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: name })

      const userRef = ref(database, `0UI/users/${user.uid}`)
      await set(userRef, { 
        name,
        email,
        credits: 60,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      })

      alert("Faça seu login")
      router.push("/signin")
    } catch (error: any) {
      console.error("Error: ", error);
      return setError(getFirebaseErrorMessage(error.code))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("interface.sign_up_title")}</CardTitle>
          <CardDescription>{t("interface.sign_up_description")}</CardDescription>
          {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("interface.name_label")}</Label>
            <Input value={name} onChange={(e: any) => setName(e.target.value)} id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("interface.email_label")}</Label>
            <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("interface.password_label")}</Label>
            <Input placeholder="*****" value={password} onChange={(e: any) => setPassword(e.target.value)} id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("interface.confirm_password_label")}</Label>
            <Input placeholder="*****" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} id="confirmPassword" type="password" required />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              <Link href="#" className="text-primary underline-offset-4 hover:underline">
                {t("interface.terms_and_conditions")}
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full">
            {t("interface.create_account_button")}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            {t("interface.already_have_account")}{" "}
            <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
              {t("interface.sign_in_link")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
