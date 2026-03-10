"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

const handleLogin = async (e:any)=>{

e.preventDefault()
setLoading(true)

const res:any = await signIn("credentials",{
redirect:false,
email,
password
})

if(res?.error){

setError("Invalid email or password")
setLoading(false)

}else{

// fetch session to get role
const session = await fetch("/api/auth/session")
const sessionData = await session.json()

const role = sessionData?.user?.role

if(role === "recruiter"){
router.push("/recruiter/dashboard")
}else{
router.push("/dashboard")
}

}

}

return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<form
onSubmit={handleLogin}
className="bg-white p-8 shadow-lg rounded-xl w-96">

<h2 className="text-2xl font-bold mb-6 text-center">
Login
</h2>

<input
type="email"
placeholder="Email"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
type="submit"
className="bg-black text-white w-full p-2 rounded hover:bg-gray-800">

{loading ? "Logging in..." : "Login"}

</button>

{error && (
<p className="text-red-500 text-center mt-3">
{error}
</p>
)}

</form>

</div>

)

}