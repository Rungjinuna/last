import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

interface ActiveFileContextType {
  activeFile: string
  setActiveFile: (fileContent: string) => void
  addTab: (tab: string) => void
  removeTab: (tab: string) => void
  tabs: string[]
  setTabs: Dispatch<SetStateAction<string[]>> // setTabs 함수의 타입 명시
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
  const [tabs, setTabs] = useState<string[]>([])

  const addTab = (tab: string) => {
    setTabs(prevTabs => [...prevTabs, tab])
  }

  const removeTab = (tab: string) => {
    setTabs(prevTabs => prevTabs.filter(id => id !== tab))
  }

  return (
    <ActiveFileContext.Provider value={{ activeFile, setActiveFile, addTab, removeTab, tabs, setTabs }}>
      {children}
    </ActiveFileContext.Provider>
  )
}
