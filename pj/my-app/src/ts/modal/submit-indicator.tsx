import { useEffect, useRef } from "react";
import moment from "moment";
import "moment/locale/ja";

export interface accepttedContentData {
    name: string;
    gender: string;
    age: string;
    address: string;
    message: string;
}

interface ISubmitIndicatorArgs {
    formValues: accepttedContentData;
    onCloseModal: () => void;
}

const textTemplate = `※ご意見フォーム送信フェイク※
下記内容で承りました。

【氏名】$name
【性別】$gender
【年齢】$age歳
【住所】$address
【ご意見内容】
$message

-----------------------

受理日時：$date

`;

export function createTextForAccepttedContent(data: accepttedContentData) {

    // convert gender:int to string
    data.gender = ["その他", "男性", "女性"][Number(data.gender)];

    let text = textTemplate;
    let key: keyof accepttedContentData;
    for (key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            text = text.replace("$" + key, data[key]);
        }
    }
    text = text.replace("$date", moment().format("YYYY年MM月DD日"));

    return text;
}

export function createTextBlob(text: string) {
    const blob = new Blob([text], { type: "text/plain" });
    return URL.createObjectURL(blob);
}

export function SubmitIndicator({
    formValues,
    onCloseModal,
}: ISubmitIndicatorArgs) {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // focus modal-screen
        setTimeout(() => {
            ref.current?.focus();
        }, 0);
        document.body.classList.add("preventScroll");
        return () => {
            document.body.classList.remove("preventScroll");
        };
    }, []);
    const onClickDownload = () => {
        const text = createTextForAccepttedContent(formValues);
        const link = document.createElement("a");
        link.download = "受理内容.txt";
        link.href = createTextBlob(text);

        link.click();

        URL.revokeObjectURL(link.href);
    };

    const onClickClose = () => {
        onCloseModal();
    };

    return (
        <>
            <div id="modal-container">
                <div id="modal-box">
                    <div id="modal-message">ご意見を受け付けました。</div>
                    <button
                        id="modal-download"
                        onClick={onClickDownload}
                        ref={ref}
                    >
                        送信内容のダウンロード
                    </button>
                    <div
                        id="modal-close"
                        tabIndex={0}
                        role="button"
                        aria-label="閉じる"
                        onClick={onClickClose}
                    >
                        ✕
                    </div>
                </div>
            </div>
            <div id="cover-div"></div>
        </>
    );
}
