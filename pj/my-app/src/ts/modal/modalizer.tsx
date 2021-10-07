import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface IModalizerArgs {
    modalContainer: HTMLElement;
    children: React.ReactNode;
}

export function Modalizer({ modalContainer, children }: IModalizerArgs) {
    const el = document.createElement("div");
    useEffect(() => {
        modalContainer.append(el);
        return () => {
            el.remove();
        };
    }, [modalContainer, el]);

    return createPortal(children, el);
}
