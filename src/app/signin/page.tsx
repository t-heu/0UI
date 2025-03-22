"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../api/firebase";
import { useUser } from "../context/userContext"
import { useTranslation } from 'react-i18next';

export default function SignInPage() {
  const { user } = useUser()
  const { t } = useTranslation();
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log(user)
    if (user) router.push("/")
  }, [user, router]);

  function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      "auth/user-not-found": t("errors.auth/user-not-found"),
      "auth/wrong-password": t("errors.auth/wrong-password"),
      "auth/invalid-email": t("errors.invalid_email"),
      "auth/user-disabled": t("errors.auth/user-disabled"),
      "auth/too-many-requests": t("errors.too_many_requests"),
      "auth/network-request-failed": t("errors.network_error")
    };
    
    return errorMessages[errorCode] || t("errors.error_logging_in");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      return setError(t("errors.fields_required"));
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("authToken", user.uid);

      router.push("/");
    } catch (error: any) {
      // console.error("Erro ao cadastrar usuário:", error);
      return setError(getFirebaseErrorMessage(error.code))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("interface.sign_in_title")}</CardTitle>
          <CardDescription>{t("interface.sign_in_description")}</CardDescription>
          {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("interface.email_label")}</Label>
              <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("interface.password_label")}</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  {t("interface.forgot_password")}
                </Link>
              </div>
              <Input value={password} onChange={(e: any) => setPassword(e.target.value)} id="password" placeholder="*****" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              {t("interface.sign_in_button")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            {t("interface.sign_up_prompt")}{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              {t("interface.sign_up_prompt_link")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
