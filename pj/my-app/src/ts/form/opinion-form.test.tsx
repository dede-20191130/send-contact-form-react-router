import React from "react";
import {
    screen,
    render,
    fireEvent,
    waitFor,
    RenderResult,
} from "@testing-library/react";
import { OpinionForm } from "./opinion-form";
import { MemoryRouter, Route } from 'react-router-dom'

const mockedPropOnSubmit = jest.fn();

function inputProperVals(renderResult: RenderResult) {
    fireEvent.input(renderResult.getByRole("textbox", { name: /ご氏名\:/ }), {
        target: {
            value: "standard name",
        },
    });
    fireEvent.input(
        renderResult.getByRole("spinbutton", { name: /ご年齢\:/ }),
        {
            target: {
                value: "20",
            },
        }
    );
    fireEvent.input(renderResult.getByRole("textbox", { name: /ご住所\:/ }), {
        target: {
            value: "Nagoya City; Aichi Prefecture",
        },
    });
    fireEvent.input(renderResult.getByRole("textbox", { name: /ご意見\:/ }), {
        target: {
            value: "this is a opinion for this site.",
        },
    });
}

describe("OpinionForm", () => {
    let renderResult: RenderResult;

    beforeEach(() => {
        renderResult = render(
            <MemoryRouter >
                <Route path="/">
                    <OpinionForm onSubmit={mockedPropOnSubmit}></OpinionForm>
                </Route>
                <Route path="/result">
                    <p>this is a result</p>
                </Route>
            </MemoryRouter>
        );
    });

    afterEach(() => {
        renderResult.unmount();
        mockedPropOnSubmit.mockClear();
    });

    it("should display required error when value is invalid", async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(4);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
    });

    it("should display matching error when fname is invalid", async () => {
        inputProperVals(renderResult);

        // vacant input
        fireEvent.input(screen.getByRole("textbox", { name: /ご氏名\:/ }), {
            target: {
                value: "",
            },
        });

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご氏名\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");

        // over 21
        fireEvent.input(screen.getByRole("textbox", { name: /ご氏名\:/ }), {
            target: {
                value: "A".repeat(21),
            },
        });

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご氏名\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("A".repeat(21));
    });
    it("should display matching error when fage is invalid", async () => {
        inputProperVals(renderResult);

        // under 0
        fireEvent.input(
            renderResult.getByRole("spinbutton", { name: /ご年齢\:/ }),
            {
                target: {
                    value: "-1",
                },
            }
        );

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("spinbutton", {
                    name: /ご年齢\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("-1");

        // not nummeric
        fireEvent.input(
            renderResult.getByRole("spinbutton", { name: /ご年齢\:/ }),
            {
                target: {
                    value: "11 old",
                },
            }
        );

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("spinbutton", {
                    name: /ご年齢\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");
    });
    it("should display matching error when faddress is invalid", async () => {
        inputProperVals(renderResult);

        // over 100
        fireEvent.input(
            renderResult.getByRole("textbox", { name: /ご住所\:/ }),
            {
                target: {
                    value: "A".repeat(101),
                },
            }
        );

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご住所\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("A".repeat(101));
    });
    it("should display matching error when fmessage is invalid", async () => {
        inputProperVals(renderResult);

        // over 2000
        fireEvent.input(
            renderResult.getByRole("textbox", { name: /ご意見\:/ }),
            {
                target: {
                    value: "A".repeat(2001),
                },
            }
        );

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).toHaveLength(1);
        expect(mockedPropOnSubmit).not.toHaveBeenCalled();
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご意見\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("A".repeat(2001));
    });
    it("should not display error when value is valid", async () => {
        inputProperVals(renderResult);

        fireEvent.click(screen.getByLabelText("男性"));

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() =>
            expect(screen.queryAllByRole("alert")).toHaveLength(0)
        );

        // onsubmit called
        expect(mockedPropOnSubmit).toBeCalledWith({
            fname: "standard name",
            fgender: "1",
            fage: "20",
            faddress: "Nagoya City; Aichi Prefecture",
            fmessage: "this is a opinion for this site.",
        });

        // show result screen
        expect(screen.getByText(/this is a result/i)).toBeInTheDocument();


    });
    it("should delete data after reset button works", async () => {
        inputProperVals(renderResult);

        fireEvent.click(screen.getByLabelText("男性"));

        fireEvent.click(screen.getByRole("button", { name: "Reset" }));

        await waitFor(() =>
            expect(screen.queryAllByRole("alert")).toHaveLength(0)
        );

        // data-cleaned after reset
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご氏名\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");
        expect(
            (
                screen.getByRole("spinbutton", {
                    name: /ご年齢\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご住所\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");
        expect(
            (
                screen.getByRole("textbox", {
                    name: /ご意見\:/,
                }) as HTMLInputElement
            ).value
        ).toBe("");
    });
});
