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
    setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    formValues: accepttedContentData;
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

function parseGender(gender: string) {
    return ["その他", "男性", "女性"][Number(gender)];
}

export function createTextForAccepttedContent(data: accepttedContentData, submiteedDate: string) {

    // convert gender:int to string
    data.gender = parseGender(data.gender);

    let text = textTemplate;
    let key: keyof accepttedContentData;
    for (key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            text = text.replace("$" + key, data[key]);
        }
    }
    text = text.replace("$date", submiteedDate);

    return text;
}

export function createTextBlob(text: string) {
    const blob = new Blob([text], { type: "text/plain" });
    return URL.createObjectURL(blob);
}

export function SubmitIndicator({
    formValues,
    setIsSubmitted,
}: ISubmitIndicatorArgs) {

    const submiteedDate = moment().format("YYYY年MM月DD日");

    useEffect(() => {
        return () => {
            setIsSubmitted(false);
        }
    }, []);
    const onClickDownload = () => {
        const text = createTextForAccepttedContent(formValues, submiteedDate);
        const link = document.createElement("a");
        link.download = "受理内容.txt";
        link.href = createTextBlob(text);

        link.click();

        URL.revokeObjectURL(link.href);
    };

    return (
        <>
            <div id="modal-container">
                <div id="modal-box">
                    <h2 id="modal-message">ご意見を受け付けました。</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>氏名</td>
                                <td>{formValues.name}</td>
                            </tr>
                            <tr>
                                <td>性別</td>
                                <td>{parseGender(formValues.gender)}</td>
                            </tr>
                            <tr>
                                <td>年齢</td>
                                <td>{formValues.age} 歳</td>
                            </tr>
                            <tr>
                                <td>住所</td>
                                <td>{formValues.address}</td>
                            </tr>
                            <tr>
                                <td>ご意見内容</td>
                                <td>{formValues.message}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>受理日時：{submiteedDate}</p>
                    <button
                        id="modal-download"
                        onClick={onClickDownload}
                    >
                        送信内容のダウンロード
                    </button>
                </div>
            </div>
        </>
    );
}
