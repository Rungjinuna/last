import React, { useState } from "react"
import FileTree from "../../components/filetree/FileTree"
import Editor from "../../components/editor/Editor"
import { ActiveFileProvider } from "../../context/ActiveFileContext"

const IDEPage = () => {
  const [isFileTreeVisible, setIsFileTreeVisible] = useState(true)

  const toggleFileTree = () => {
    setIsFileTreeVisible(!isFileTreeVisible)
  }

  return (
    <ActiveFileProvider>
      <div className="flex h-screen bg-gray-500">
        <div className={`transition-width duration-500 ${isFileTreeVisible ? "w-64" : "w-0"} overflow-auto`}>
          <FileTree />
        </div>

        {/* 토글 버튼을 FileTree 컨테이너 바깥에 배치하고, 
            FileTree 컨테이너의 가시성 상태에 따라 버튼의 위치를 조정 */}
        <button
          onClick={toggleFileTree}
          className="mt-5 ml-[-1.25rem] z-20 p-2 bg-gray-700 text-white  hover:bg-blue-700 transition-transform duration-500"
          style={{ transform: `translateX(${isFileTreeVisible ? "100%" : "0"})` }}
        >
          {isFileTreeVisible ? "«" : "»"}
        </button>

        <div className="flex-1 overflow-y-auto pl-5 mt-5 ">
          <Editor />
        </div>
      </div>
    </ActiveFileProvider>
  )
}
export default IDEPage
