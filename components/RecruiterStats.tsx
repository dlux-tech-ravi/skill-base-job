export default function RecruiterStats(){

const stats = [
{title:"Total Jobs", value:"12"},
{title:"Applications", value:"84"},
{title:"Shortlisted", value:"23"},
{title:"Hired", value:"5"}
]

return(

<div className="grid grid-cols-4 gap-6">

{stats.map((item,index)=>(

<div key={index} className="bg-white p-6 rounded-xl shadow">

<p className="text-gray-500 text-sm ">{item.title}</p>

<p className="text-2xl font-bold text-black">{item.value}</p>

</div>

))}

</div>

)

}