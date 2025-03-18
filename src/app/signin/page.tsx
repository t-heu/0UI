"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import bcrypt from "bcryptjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { useUser } from "../context/userContext"
import { get, ref, database, query, orderByChild, equalTo } from "../api/firebase";

export default function SignInPage() {
  const { isLogged } = useUser()

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLogged) window.location.href = "/"
  }, [isLogged]);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (!email.trim() || !password.trim()) return;

      if (!password || !email) {
        return setError("Todos os campos são obrigatórios.");
      }
      
      const usersRef = ref(database, `0UI/users`);
      const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(emailQuery);
      const data: any = snapshot.val();
      const key = Object.keys(data)[0]

      if (!snapshot.exists()) {
        return setError("Usuário não encontrado.");
      }

      if (!data || !(await bcrypt.compare(password, data[key].password))) {
        return setError("Usuário ou senha incorretos.");
      }

      localStorage.setItem("authToken", key);
      window.location.href = "/"
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return setError("Erro interno do servidor.");
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
