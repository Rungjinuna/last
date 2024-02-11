import React, { createContext, useContext, useState, ReactNode } from "react"

interface ActiveFileContextType {
  activeFile: string
  setActiveFile: (fileContent: string) => void
}

const ActiveFileContext = createContext<ActiveFileContextType | undefined>(undefined)

export const useActiveFile = () => {
  const context = useContext(ActiveFileContext)
  if (!context) {
    throw new Error("useActiveFile must be used within a ActiveFileProvider")
  }
  return context
}

interface ActiveFileProviderProps {
  children: ReactNode
}

export const ActiveFileProvider: React.FC<ActiveFileProviderProps> = ({ children }) => {
  const [activeFile, setActiveFile] = useState<string>("")

  return <ActiveFileContext.Provider value={{ activeFile, setActiveFile }}>{children}</ActiveFileContext.Provider>
}
