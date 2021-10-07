import React from "react";
import {
    render,
    screen,
    RenderResult,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";

function WrappedApp() {
    return (
        <>
            <App />
            <div id="modal-root"></div>
        </>
    );
}

describe("App", () => {
    let renderResult: RenderResult;

    beforeEach(() => {
        renderResult = render(<WrappedApp />);
    });

    afterEach(() => {
        renderResult.unmount();
    });

    it("should not show modal-component when form submittion fails.", async () => {
        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        expect(await screen.findAllByRole("alert")).not.toEqual([]);

        expect(
            screen.queryByText(/ご意見を受け付けました。/)
        ).not.toBeInTheDocument();
    });

    it("should show modal-component when form submittion successes.", async () => {
        fireEvent.input(screen.getByRole("textbox", { name: /ご氏名\:/ }), {
            target: {
                value: "standard name",
            },
        });
        fireEvent.input(screen.getByRole("spinbutton", { name: /ご年齢\:/ }), {
            target: {
                value: "20",
            },
        });
        fireEvent.input(screen.getByRole("textbox", { name: /ご住所\:/ }), {
            target: {
                value: "Nagoya City; Aichi Prefecture",
            },
        });
        fireEvent.input(screen.getByRole("textbox", { name: /ご意見\:/ }), {
            target: {
                value: "this is a opinion for this site.",
            },
        });

        fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() =>
            expect(screen.queryAllByRole("alert")).toHaveLength(0)
        );

        expect(
            screen.queryByText(/ご意見を受け付けました。/)
        ).toBeInTheDocument();
    });

    describe("after submittion", () => {
        beforeEach(async () => {
            // submittion
            fireEvent.input(screen.getByRole("textbox", { name: /ご氏名\:/ }), {
                target: {
                    value: "standard name",
                },
            });
            fireEvent.input(
                screen.getByRole("spinbutton", { name: /ご年齢\:/ }),
                {
                    target: {
                        value: "20",
                    },
                }
            );
            fireEvent.input(screen.getByRole("textbox", { name: /ご住所\:/ }), {
                target: {
                    value: "Nagoya City; Aichi Prefecture",
                },
            });
            fireEvent.input(screen.getByRole("textbox", { name: /ご意見\:/ }), {
                target: {
                    value: "this is a opinion for this site.",
                },
            });
        });

        it("should not close modal-popup when DL-button is put.", async () => {
            HTMLAnchorElement.prototype.click = jest.fn();
            global.URL.revokeObjectURL = jest.fn();
            global.URL.createObjectURL = jest.fn(
                (blob: any) => "return createObjectURL"
            );

            fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
            await waitFor(() => {
                fireEvent.click(
                    screen.getByRole("button", {
                        name: "送信内容のダウンロード",
                    })
                );

                expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(
                    1
                );
                expect(
                    screen.queryByText(/ご意見を受け付けました。/)
                ).toBeInTheDocument();
            });

            // restore
            (
                HTMLAnchorElement.prototype.click as jest.Mock<any, any>
            ).mockRestore();
            (global.URL.revokeObjectURL as jest.Mock<any, any>).mockRestore();
            (global.URL.createObjectURL as jest.Mock<any, any>).mockRestore();
        });

        it("should close modal-popup when close-button is put.", async () => {
            fireEvent.submit(screen.getByRole("button", { name: "Submit" }));
            await waitFor(() => {
                fireEvent.click(screen.getByRole("button", { name: "閉じる" }));

                expect(
                    screen.queryByText(/ご意見を受け付けました。/)
                ).not.toBeInTheDocument();
            });
        });
    });
});
