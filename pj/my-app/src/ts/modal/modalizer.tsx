import React, { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom'
import { useForm } from "react-hook-form";

interface IModalizerArgs {
    modalContainer: HTMLElement,
    children: React.ReactNode
}

export function Modalizer({ modalContainer, children }: IModalizerArgs) {
    const el = useRef(document.createElement("div"));
    useEffect(() => {
        modalContainer.append(el.current);
        return () => {
            el.current.remove();
        };
    }, []);

    return createPortal(children, el.current);
}

