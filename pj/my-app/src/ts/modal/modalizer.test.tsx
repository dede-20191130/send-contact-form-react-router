import React, { useRef } from 'react'
import { screen, render, fireEvent, waitFor, RenderResult } from '@testing-library/react'
import { Modalizer } from './modalizer';

function ModalizerTester() {
    const [showModal, setShowModal] = React.useState(false);
    const ref = useRef(null!);
    return (
        <>
            <div id="modalContainer" ref={ref}></div>
            <div>
                {showModal && (
                    <Modalizer modalContainer={ref.current}>
                        <div>modaliezd-box</div>
                    </Modalizer>
                )}

                <button onClick={() => setShowModal(!showModal)}>switch Modal</button>
            </div>
        </>
    );
}

describe("modaliser", () => {
    it("should show modalied box and switch off box when removing Modalier Component", async () => {
        render(<ModalizerTester />)

        // at first there's not modalized box
        expect(screen.queryByText("modaliezd-box")).not.toBeInTheDocument();

        // after switching there's modalized box 
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("modaliezd-box")).toBeInTheDocument();

        // after second switching there's not modalized box 
        fireEvent.click(screen.getByRole("button"));
        expect(screen.queryByText("modaliezd-box")).not.toBeInTheDocument();

    });
});