import React, { useRef } from "react";
import {
    screen,
    render,
    fireEvent,
    waitFor,
    RenderResult,
} from "@testing-library/react";
import {
    createTextForAccepttedContent,
    createTextBlob,
    SubmitIndicator,
} from "./submit-indicator";

describe("createTextForAccepttedContent", () => {
    let spyedDateNow: jest.SpyInstance<number, []>;

    afterAll(() => {
        spyedDateNow.mockRestore();
    });

    it("should create text according to props", () => {
        // mock date
        spyedDateNow = jest
            .spyOn(Date, "now")
            .mockImplementation(() => 1626706800000);

        const input = {
            name: "example 太郎",
            gender: "1",
            age: "25",
            address: "example県　田中市佐藤町",
            message: "this is a test message.これはテストメッセージです。",
        };
        const text = createTextForAccepttedContent(input, "2030年11月15日");

        expect(text.startsWith("※ご意見フォーム送信フェイク※")).toBe(true);

        expect(text.includes("【氏名】" + input.name)).toBe(true);

        expect(text.includes("【性別】男性")).toBe(true);

        expect(text.includes("【年齢】" + input.age + "歳")).toBe(true);

        expect(text.includes("【住所】" + input.address)).toBe(true);

        expect(
            new RegExp("【ご意見内容】[\\s\\S]*" + input.message).test(text)
        ).toBe(true);

        expect(text.includes("受理日時：2030年11月15日")).toBe(true);
    });
});

describe("createTextBlob", () => {
    class BlobMock {
        constructor(
            private content: BlobPart[] | undefined,
            private options: BlobPropertyBag | undefined
        ) { }
    }
    let bloblstocked: typeof global.Blob;

    afterAll(() => {
        global.Blob = bloblstocked;
        (global.URL.createObjectURL as jest.Mock<any, any>).mockRestore();
    });

    it("should create blob according to arg-string", () => {
        bloblstocked = global.Blob;
        // mocking global functions
        // https://kuma-emon.com/it/pc/1247/
        global.URL.createObjectURL = jest.fn(
            (blob: BlobMock) => "return createObjectURL"
        );
        (global as any).Blob = BlobMock;

        const input = "A".repeat(77);

        const blobURLMock = createTextBlob(input);

        expect(global.URL.createObjectURL).toBeCalledWith({
            content: ["A".repeat(77)],
            options: { type: "text/plain" },
        });

        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);

        expect(blobURLMock).toBe("return createObjectURL");
    });
});

describe("SubmitIndicator", () => {
    let setIsSubmitted: jest.Mock<any, any>;
    beforeEach(() => {
        const data = {
            name: "standard name",
            gender: "1",
            age: "25",
            address: "standard address",
            message: "this is a message.",
        };
        setIsSubmitted = jest.fn();
        render(
            <SubmitIndicator formValues={data} setIsSubmitted={setIsSubmitted} />
        );
    });

    it("should show result table", () => {

        expect(screen.getByText("氏名").nextElementSibling?.textContent).toBe("standard name");
        expect(screen.getByText("性別").nextElementSibling?.textContent).toBe("男性");
        expect(screen.getByText("年齢").nextElementSibling?.textContent).toBe("25 歳");
        expect(screen.getByText("住所").nextElementSibling?.textContent).toBe("standard address");
        expect(screen.getByText("ご意見内容").nextElementSibling?.textContent).toBe("this is a message.");

    });

    it("should prepare anchor link when calling download", () => {
        // mock anchor element click
        HTMLAnchorElement.prototype.click = jest.fn();
        global.URL.revokeObjectURL = jest.fn();

        // DL button click
        fireEvent.click(
            screen.getByRole("button", { name: "送信内容のダウンロード" })
        );

        expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);

        // restore
        (
            HTMLAnchorElement.prototype.click as jest.Mock<any, any>
        ).mockRestore();
        (global.URL.revokeObjectURL as jest.Mock<any, any>).mockRestore();
    });

});
