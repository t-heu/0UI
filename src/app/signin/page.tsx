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

export default function SignInPage() {
  const { user } = useUser()
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
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-email": "O email informado não é válido.",
      "auth/user-disabled": "Usuário desativado.",
      "auth/too-many-requests": "Muitas tentativas seguidas. Aguarde e tente novamente.",
      "auth/network-request-failed": "Falha na conexão com a internet."
    };
    
    return errorMessages[errorCode] || "Erro ao fazer login. Tente novamente.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      return setError("Todos os campos são obrigatórios.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("authToken", user.uid);

      router.push("/");
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      return setError(getFirebaseErrorMessage(error.code))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your email and password to sign in to your account</CardDescription>
          {error ? <div className="text-red-500 mt-4">Error: {error}</div> : null}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input value={password} onChange={(e: any) => setPassword(e.target.value)} id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
