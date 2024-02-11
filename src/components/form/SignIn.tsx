import React from "react"
import { useNavigate } from "react-router-dom"
import SignInForm from "./SignInForm"

const SignIn = () => {
  const navigate = useNavigate()
  const handleLogin = (email: string, password: string) => {
    navigate("/")
  }
  return <SignInForm title={"Login"} getDataForm={handleLogin} />
}

export default SignIn
