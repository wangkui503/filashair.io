'use client'
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import TransferRunningCa from './transferRunningCa';
export default function TransferRunningCard({xfers}) {   

  if (!xfers) return
  console.log('TransferRunningCard--', xfers)
  
    return (
      <>
      {
        xfers?.map((xfer, i) => (
          <TransferRunningCa key={i} xfer={xfer} i={i}/>
        ))
      }
    </>
    )
}

