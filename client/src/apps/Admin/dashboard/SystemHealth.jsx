import {

CheckCircle2

} from "lucide-react";

import GlassCard from "../ui/GlassCard";

const services=[

"Backend",

"MongoDB",

"Cloudinary",

"Authentication",

];

export default function SystemHealth(){

return(

<GlassCard>

<h2 className="mb-6 text-xl font-semibold">

System Health

</h2>

<div className="space-y-4">

{

services.map(service=>(

<div

key={service}

className="flex items-center justify-between rounded-xl bg-white/5 p-4"

>

<span>

{service}

</span>

<CheckCircle2

size={20}

className="text-green-400"

/>

</div>

))

}

</div>

</GlassCard>

)

}