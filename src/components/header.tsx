"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Zap } from "lucide-react"
import { signOut } from "firebase/auth"

import { auth } from "../app/api/firebase";
import { useUser } from "../app/context/userContext"

export default function Header() {
  const { user, points, setUser } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <header className="border-b">
      {user ? (
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Picture of the author"
            />
            <span className="font-bold">0UI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Zap className="h-4 w-4 text-yellow-500" />
            <Badge variant="secondary" className="font-medium">
              {points} credits
            </Badge>
          </div>

          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage alt="Profile" />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#fafafa] w-56" align="end" forceMount>
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-[#eee]">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#eee]">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#eee]">
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Meus Pontos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-[#eee]" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ):(
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Picture of the author"
            />
            <span className="font-bold">0UI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
