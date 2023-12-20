'use client'
import React, { useEffect, useState, FormEvent } from 'react'
import { Chart } from "react-google-charts";
import { CircularProgressbar } from 'react-circular-progressbar';

const final_statuses = ['completed', 'aborted']


export default function SpeedCh({xfer}) {   
  
    const options = {
        chart: {
          title: "Transfer Rate",
          //subtitle: "in millions of dollars (USD)",
          width:"100%",
          height:"100%",
          
        },
        //curveType: 'function',
        vAxis: {
          viewWindow: {
             min: 0
          },
          format:'# Mb',
          scaleType: 'log'
        },
        animation:{
          startup: true,
          duration: 300,
          easing: 'in'
        },
        legend: 'none',
        /* backgroundColor: {
          fill:'#94a3b8'     
          }, */
        chartArea:{left:80,top:20,bottom:20,right:20,width:'100%',height:'100%'},
        hAxis: {
          format:'# s',
          gridlines: {
            count:0
          }
        },
        
      };

      
    const [index, setIndex] = useState({meta:0});
    const [gData, setGData] = useState([]);
    
    

    useEffect(() => {
      console.log("speedChart useEffect--", [...gData], xfer)
      index.meta = 0
      setGData([])
      if (!xfer?.id || final_statuses.includes(xfer?.status)) {
        return
      }
      if (gData.length < 1) {
        const title = xfer.id
        gData.push(["", title])
        console.log("speedChart title--", ["", title])
      }
      const pollingStatusThread = setInterval(() => {
      gData.push([index.meta++, (xfer.progress?.bps / 1000000)??0])
      setGData([...gData])
      if (final_statuses.includes(xfer.status)) {
        clearInterval(pollingStatusThread)                
      }      
      
      }, 1000)
      return () => clearInterval(pollingStatusThread);
    }, [xfer?.id]);


    return (
      <>
      <div className="w-full p-4 mb-4 border border-gray-200 rounded-lg shadow sm:p-6 ">
<h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl ">
  {xfer.id} - {xfer.spec?.action} - new card
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
        className="flex items-center p-2 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow "
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
        className="flex items-center p-2 text-base font-bold text-gray-900 rounded-lg bg-sky-100 hover:bg-gray-100 group hover:shadow "
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

        <div className="h-40">
          {gData.length > 0 ? (
            <Chart
              chartType="LineChart"
              height="300px"
              data={gData}
              options={options}
            />  
          ) : ''}      
    </div>
    </>
    )
}