interface MapPointProps{
top:string
left:string
label:string
color?:string
}

export default function MapPoint({
top,
left,
label,
color="bg-white"
}:MapPointProps){

return(

<div
className="group absolute -translate-x-1/2 -translate-y-1/2"
style={{top,left}}
>

<div className={`h-4 w-4 rounded-full ${color} animate-pulse shadow-[0_0_20px_currentColor]`} />

<div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-3 py-1 text-xs font-bold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">

{label}

</div>

</div>

)

}