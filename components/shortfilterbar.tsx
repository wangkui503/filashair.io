'use client'
export default function ShortFilterBar({title, setFilterPattern}) {    
    
    return (
        
      <div className="relative pt-2 pb-1 z-0 w-full group border-b border-neutral-300">
          <input
            className="block pb-1 w-full bg-transparent appearance-none peer"
            placeholder=" "
            id={title}
            name={title}
            type="text"            
            onChange={(e) => setFilterPattern(e.currentTarget?.value)}
          />
          <label
            htmlFor={title}
            className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Filter
          </label>          
        </div> 
    )

}