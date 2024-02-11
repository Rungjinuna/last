import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import WelcomePage from "./pages/WelcomePage/WelcomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import IDEPage from "./pages/IDEPage/IDEPage"
import ContainerPage from "./pages/ContainerPage/ContainerPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/container" element={<ContainerPage />}></Route>
        <Route path="/ide" element={<IDEPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
