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

export default function SignUpPage() {
  const { user } = useUser()
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
      "auth/email-already-in-use": "Este email já está cadastrado. Tente outro.",
      "auth/invalid-email": "O email informado não é válido.",
      "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
      "auth/network-request-failed": "Falha na conexão com a internet.",
      "auth/operation-not-allowed": "Cadastro com email e senha não está permitido.",
      "auth/too-many-requests": "Muitas tentativas seguidas. Tente novamente mais tarde.",
    }
    
    return errorMessages[errorCode] || "Erro ao criar conta. Tente novamente."
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null)

    if (!name.trim() || !email.trim() || !confirmPassword.trim() || !password.trim()) {
      return setError("Todos os campos são obrigatórios.")
    }

    if (/\s/.test(name)) {
      return setError("O nome de usuário não pode conter espaços.")
    }

    if (password.length < 6) {
      return setError("A senha deve ter pelo menos 6 caracteres.")
    }
    
    if (password !== confirmPassword) {
      return setError("As senhas não coincidem." );
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Atualizar o nome do usuário no Firebase Auth
      await updateProfile(user, { displayName: name })

      // Salvar informações do usuário no Database
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
      console.error("Erro ao cadastrar usuário:", error);
      return setError(getFirebaseErrorMessage(error.code))
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
