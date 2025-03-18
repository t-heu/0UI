"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import bcrypt from "bcryptjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

import { useUser } from "../context/userContext"
import { get, ref, database, set } from "../api/firebase";

export default function SignUpPage() {
  const { isLogged } = useUser()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      if (isLogged) window.location.href = "/"
    }, [isLogged]);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !confirmPassword.trim() || !password.trim()) return;

      if (!name || !password || !confirmPassword || !email) {
        return setError("Todos os campos são obrigatórios.");
      }
      
      if (password !== confirmPassword) {
        return setError("As senhas não coincidem." );
      }
      
      const userRef = ref(database, `0UI/users/${name}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return setError("Usuário já existe.");
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await set(userRef, { 
        password: hashedPassword, 
        name,
        email,
        credits: 60,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString()
      });

      alert("Faça seu login")
      window.location.href = "/signin"
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return setError("Erro interno do servidor.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
          {error ? <div className="text-red-500 mt-4">Error: {error}</div> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input value={name} onChange={(e: any) => setName(e.target.value)} id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input value={email} onChange={(e: any) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input value={password} onChange={(e: any) => setPassword(e.target.value)} id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} id="confirmPassword" type="password" required />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="#" className="text-primary underline-offset-4 hover:underline">
                terms and conditions
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
