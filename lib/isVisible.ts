import React, { useMemo, useState, useEffect, useRef } from 'react';

export function useOnScreen(ref: RefObject<HTMLElement>, callback) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) {
          callback()
        }
      }
    ), [ref])
  
  
    useEffect(() => {
      observer.observe(ref.current)
      return () => observer.disconnect()
    }, [])
  
    return isIntersecting
  }