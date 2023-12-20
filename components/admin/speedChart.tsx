'use client'
import React, { useEffect, useState, FormEvent } from 'react'
import { Chart } from "react-google-charts";
import TransferRunningCard from './transferRunningCard';

const final_statuses = ['completed', 'aborted']


export default function SpeedChart({xfers, status}) {   
  const chartEvents = [
    {
      callback: ({ chartWrapper, google }) => {
        const chart = chartWrapper.getChart();
        console.log("Selected ", xfers[chart.getSelection()[0]?.column], chart.getSelection(), chart.getSelection()[0]?.column);
        /* const chart = chartWrapper.getChart();
        chart.container.addEventListener("click", (ev) => console.log(ev)) */
        /* chart.container.addEventListener("mouseover", (ev) => {
          const { row, column } = ev;
          console.warn("mouse over ", { row, column });
        }) */
        //if (chart.getSelection().length < 1) {
          console.log("unselect---", chart.getSelection())
          for (let i = 0; i < xfers.length; i++) {
            const cardID = 'transferCard_' + i
            const card = document.getElementById(cardID)
            if (card) {
              card.classList.remove('bg-blue-200')
            }
          }
          //return
        //}

        const cardID = 'transferCard_' + (chart.getSelection()[0]?.column-1)
        const card = document.getElementById(cardID)
        console.log("cardID---", chart.getSelection()[0]?.column-1, cardID, card)
        if (card) {
          card.classList.add('bg-blue-200')
          card.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
      },
      eventName: "select"
    }
  ];

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
      console.log("speedChart useEffect--", [...gData], xfers)
      index.meta = 0
      setGData([])
      if (!xfers || xfers.length < 1 || final_statuses.includes(status)) {
        return
      }
      if (gData.length < 1) {
        const title = xfers.map((data)=>data.id)
        gData.push(["", ...title])
        console.log("speedChart title--", ["", ...title])
      }
      const pollingStatusThread = setInterval(() => {
      const row = xfers?.map(xfer => xfer.progress)
      gData.push([index.meta++, ...row.map(pro => (Number(pro?.bps) / 1000000)??0)])    
      setGData([...gData])
      const completeds = xfers?.reduce(
        (accumulator, currentValue) => accumulator + (final_statuses.includes(currentValue.status) ? 1 : 0),
        0,
      );
      if (completeds == xfers?.length) {
        clearInterval(pollingStatusThread)        
        
      }      
      
      }, 1000)
      return () => clearInterval(pollingStatusThread);
    }, [xfers]); 


    return (
      <>
      <TransferRunningCard xfers={xfers}/>
        <div className="h-40">
          {gData.length > 0 ? (
            <Chart
              chartType="LineChart"
              height="300px"
              data={gData}
              options={options}
              chartEvents={chartEvents}
            />  
          ) : ''}      
    </div>
    </>
    )
}