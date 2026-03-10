
"use client"

import Link from "next/link"

export default function HomeHeader(){

return(

<header className="bg-white shadow-sm">

<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

{/* Logo */}

<h1 className="text-xl font-bold text-blue-600">
SkillJob
</h1>


{/* Navigation */}

<div className="flex items-center gap-4">

<Link
href="/login"
className="px-4 py-2 border rounded-lg hover:bg-gray-100"
>
Login
</Link>

<Link
href="/register"
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
Register
</Link>

</div>

</div>

</header>

)

}