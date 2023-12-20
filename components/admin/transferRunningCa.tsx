'use client'
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
export default function TransferRunningCa({xfer, i}) {   

  if (!xfer) return
console.log('TransferRunningCa--', xfer)
  
    return (
            <div id={'transferCard_' + i} className="w-full p-4 mb-4 border border-gray-200 rounded-lg shadow sm:p-6">
<h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl">
  {xfer.id} - {xfer.spec?.action} - {xfer.status}
  </h5>

  <p className="text-sm font-normal text-gray-500">
  Source - {xfer.spec?.source?.share_alias}
  </p>
  <ul className="my-4 space-y-3">
  {
    xfer.spec?.source?.paths?.map((path, i) => {
        return (
            <li key={i}>
      <a
        href="#"
        className="flex items-center p-2 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow"
      >
        <span className="flex-1 whitespace-nowrap">
            {path}
        </span>        
      </a>
    </li>
        )
    })
    }
    
    
  </ul>
  <div>
  <p className="text-sm font-normal text-gray-500">
  Dest - {xfer.spec?.dest?.share_alias}
  </p>
    <a
        href="#"
        className="flex items-center p-2 text-base font-bold text-gray-900 rounded-lg bg-sky-100 hover:bg-gray-100 group hover:shadow"
      >
        <span className="flex-1 whitespace-nowrap">
        {xfer.spec?.dest.path}
        </span>        
      </a>
  </div>
  
  

<>
  <div className="flex justify-between">
  <div className="w-full my-auto bg-gray-200 rounded-l-full h-2.5 ">
    <div className="bg-blue-600 h-2.5 rounded-l-full" style={{ width: `${xfer.progress?.progress??0}%` }} />
  </div>
    <span className="w-20 font-medium text-blue-700 ">
    <CircularProgressbar value={xfer.progress?.progress??0} text={`${xfer.progress?.progress?.toFixed(2)??0}%`} />
    </span>
  </div>
  
</>



</div>

    )
}

