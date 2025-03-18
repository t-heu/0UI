"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { get, ref, database } from "../../app/api/firebase";

interface UserContextType {
  isLogged: string | null;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  setIsLogged: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState<string | null>(null)
  const [points, setPoints] = useState<number>(0)

  useEffect(() => {
    const user = localStorage.getItem("authToken");
    if (user) setIsLogged(user);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!isLogged) return

      const userRef = ref(database, `0UI/users/${isLogged}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data: any = snapshot.val()
        setPoints(data.credits)
      }
    }

    fetchData()
  }, [isLogged])

  return <UserContext.Provider value={{ isLogged, points, setPoints, setIsLogged }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
