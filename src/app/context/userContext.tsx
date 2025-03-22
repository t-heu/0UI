"use client"
import '../i18n';

import { createContext, useContext, useEffect, useState } from "react"
import { get, ref, database, auth } from "../../app/api/firebase";
import { onAuthStateChanged, User } from "firebase/auth"

interface UserContextType {
  user: User | null;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        try {
          const userRef = ref(database, `0UI/users/${currentUser.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            setPoints(snapshot.val().credits || 0)
          }
        } catch (err) {
          console.error("Erro ao buscar créditos do usuário:", err)
        }
      } else {
        setPoints(0)
      }
    })

    return () => unsubscribe()
  }, [])

  return <UserContext.Provider value={{ user, points, setPoints, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
