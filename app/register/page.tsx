"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Register() {

const router = useRouter()

const [success,setSuccess] = useState(false)

const [form,setForm] = useState({
name:"",
email:"",
password:"",
role:"jobseeker"
})

const handleSubmit = async (e:any)=>{

e.preventDefault()

await axios.post("/api/register",form)

setSuccess(true)

setTimeout(()=>{
router.push("/login")
},3000)

}

return(

<div className="flex justify-center items-center h-screen">

<form
onSubmit={handleSubmit}
className="bg-white p-8 shadow-lg rounded-xl w-96">

<h2 className="text-2xl font-bold mb-4">
Register
</h2>

<input
placeholder="Name"
className="border p-2 w-full mb-3"
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<input
placeholder="Email"
className="border p-2 w-full mb-3"
onChange={(e)=>setForm({...form,email:e.target.value})}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-3"
onChange={(e)=>setForm({...form,password:e.target.value})}
/>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setForm({...form,role:e.target.value})}
>
<option value="jobseeker">Job Seeker</option>
<option value="recruiter">Recruiter</option>
</select>

<button className="bg-blue-600 text-white w-full p-2 rounded">
Register
</button>

{success && (
<p className="text-green-600 text-center mt-3">
Account created successfully. Redirecting to login...
</p>
)}

</form>

</div>

)

}