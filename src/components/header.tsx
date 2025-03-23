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
import { useTranslation } from 'react-i18next';

import BrasilFlag from '../app/assets/brasil-flag.svg';
import EuaFlag from '../app/assets/eua-flag.svg';
import { auth } from "../app/api/firebase";
import { useUser } from "../app/context/userContext"

export default function Header() {
  const { user, points, setUser } = useUser()
  const { t, i18n } = useTranslation();

  const router = useRouter()

  const selectedLanguage = i18n.language;

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  function handleChangeLanguage(language: string) {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold">0UI</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback>
                    <Image
                      src={selectedLanguage === 'pt-BR' ? BrasilFlag : EuaFlag}
                      width={40}
                      height={40}
                      alt="logo"
                    />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-[#fafafa] w-10" align="end" forceMount>
              <DropdownMenuItem className="hover:bg-[#eee]" onClick={() => handleChangeLanguage('pt-BR')}>
                <Image
                  src={BrasilFlag}
                  width={35}
                  height={35}
                  alt="logo"
                />
                <span>pt-BR</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#eee]" onClick={() => handleChangeLanguage('en-US')}>
                <Image
                  src={EuaFlag}
                  width={35}
                  height={35}
                  alt="logo"
                />
                <span>en-US</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {user ? (
          <>
          <div className="flex items-center gap-4">
            <Zap className="h-4 w-4 text-yellow-500" />
            <Badge variant="secondary" className="font-medium">
              {points} {t("interface.credits")}
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
              <DropdownMenuLabel>{t("interface.account_menu_label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-[#eee]">
                <User className="mr-2 h-4 w-4" />
                <span>{t("interface.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#eee]">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("interface.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#eee]">
                <Zap className="mr-2 h-4 w-4" />
                <span>{t("interface.my_points")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-[#eee]" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("interface.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">{t("interface.signin")}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{t("interface.signup")}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
