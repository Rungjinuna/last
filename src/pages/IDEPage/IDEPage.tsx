import React, { useState } from "react"
import FileTree from "../../components/filetree/FileTree"
import Editor from "../../components/editor/Editor"
import { ActiveFileProvider, useActiveFile } from "../../context/ActiveFileContext"

const IDEPage = () => {
  return (
    <ActiveFileProvider>
      <IDEContent />
    </ActiveFileProvider>
  )
}

const IDEContent = () => {
  const [isFileTreeVisible, setIsFileTreeVisible] = useState(true)
  const { tabs, setTabs } = useActiveFile()

  const toggleFileTree = () => {
    setIsFileTreeVisible(!isFileTreeVisible)
  }

  const addTab = (fileData: string) => {
    setTabs(prevTabs => [...prevTabs, fileData])
  }

  const removeTab = (fileIndex: string) => {
    setTabs(prevTabs => prevTabs.filter(id => id !== fileIndex))
  }

  return (
    <div className="flex h-screen bg-gray-500">
      <div className={`transition-width duration-500 ${isFileTreeVisible ? "w-64" : "w-0"} overflow-auto`}>
        <FileTree />
      </div>

      <button
        onClick={toggleFileTree}
        className="mt-5 ml-[-1.25rem] z-20 p-2 bg-gray-700 text-white  hover:bg-blue-700 transition-transform duration-500"
        style={{ transform: `translateX(${isFileTreeVisible ? "100%" : "0"})` }}
      >
        {isFileTreeVisible ? "«" : "»"}
      </button>

      <div className="flex-1 overflow-y-auto pl-5 mt-5">
        <div className="flex">
          {tabs.map((fileData, index) => (
            <div key={index} className="bg-gray-300 mr-2 p-2 rounded-lg ">
              {fileData}
              <button onClick={() => removeTab(fileData)} className="ml-1">
                x
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <Editor />
        </div>
      </div>
    </div>
  )
}

export default IDEPage
