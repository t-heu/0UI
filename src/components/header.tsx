"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Settings, Zap } from "lucide-react"
import Link from "next/link"

interface PreviewProps {
  isLogged: boolean
}

export default function Header({isLogged}: PreviewProps) {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    setPoints(60)
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
    // Add your logout logic here
  }

  return (
    <header className="w-full border-b light:bg-[#fafafa] flex justify-center">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
           { '<0UI/>'}
          </Link>
        </div>

        {isLogged ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <Badge variant="secondary" className="font-medium">
              {points} credits
            </Badge>
          </div>
        )}
      </div>
    </header>
  )
}
