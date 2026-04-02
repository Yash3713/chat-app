import  { useEffect } from 'react'
import type {FC} from 'react'
import { Navigate, Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import ProfilePage from './pages/ProfilePage'
import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast'

const App:FC = () => {
  const {authUser,checkAuth,isCheckingAuth} =useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log({authUser})

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser? <HomePage/>: <Navigate to= "/login"/>}/>
        <Route path='/signup' element={!authUser?<SignUpPage/>: <Navigate to= "/"/>}/>
        <Route path='/login' element={!authUser?<SignInPage/>:<Navigate to= "/"/>}/>
        <Route path='/settings' element={authUser? <SettingsPage/>: <Navigate to= "/login"/>}/>
        <Route path='/settings' element={authUser?<ProfilePage/>: <Navigate to= "/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App