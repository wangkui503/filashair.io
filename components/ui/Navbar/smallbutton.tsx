'use client';
import React, { useEffect } from "react";

export default function MountOnClickHandler() {
  useEffect(function mount() {
    function onClick() {
        const menu = document.querySelector('#menu');
        menu?.classList.toggle('hidden');
        menu?.classList.toggle('bg-slate-200');
    }
    const button = document.querySelector('#menu-button');
    button?.addEventListener('click', onClick);
    return function unMount() {
        window.removeEventListener("click", onClick);
    };
    });

    return null;
}