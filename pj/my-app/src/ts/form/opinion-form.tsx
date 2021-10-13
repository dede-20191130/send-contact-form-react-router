import { useState, FocusEventHandler } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Prompt } from 'react-router-dom'

interface OpinionFormArgs {
    onSubmit: (data: IFormInput) => void;
}

export interface IFormInput {
    fname: string;
    fgender: string;
    fage: string;
    faddress: string;
    fmessage: string;
}
export function OpinionForm({ onSubmit }: OpinionFormArgs) {
    const history = useHistory();
    const [onSubmitting, setOnSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
    } = useForm<IFormInput>({
        criteriaMode: "all",
        defaultValues: {
            fgender: "0",
        },
    });

    const onFormSubmit = (data: IFormInput) => {
        onSubmit(data);
        setOnSubmitting(true);
        history.push("/result");
    };

    const onInputFocus: FocusEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (ev) => {
        document
            .querySelector(`label[for="${ev.currentTarget?.id}"]`)
            ?.classList.add("active");
    };

    const onInputBlur: FocusEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (ev) => {
        if (ev.currentTarget.value === "") {
            document
                .querySelector(`label[for="${ev.currentTarget?.id}"]`)
                ?.classList.remove("active");
        }
    };

    // delete data after submission
    // https://codesandbox.io/s/react-hook-form-handlesubmit-with-reset-xu1zu?file=/src/index.js

    return (
        <>
            <form
                id="opinion-send"
                name="opinion-send"
                autoComplete="on"
                onSubmit={handleSubmit(onFormSubmit)}
            >
                <h2>
                    <span>ご意見フォーム</span>
                </h2>
                <div className="controls">
                    <input
                        id="fname"
                        type="text"
                        {...register("fname", {
                            required: "名前は必須です。",
                            maxLength: {
                                value: 20,
                                message: "名前は1～20文字で入力してください。",
                            },
                        })}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                    />
                    <label htmlFor="fname">ご氏名: </label>
                    {errors?.fname && <p role="alert">{errors.fname.message}</p>}
                </div>
                <div className="controls">
                    <fieldset>
                        <legend>ご性別</legend>
                        <input
                            type="radio"
                            id="fgender-other"
                            {...register("fgender", { required: true })}
                            value="0"
                        />
                        <label htmlFor="fgender-other">その他</label>
                        <input
                            type="radio"
                            id="fgender-man"
                            {...register("fgender", { required: true })}
                            value="1"
                        />
                        <label htmlFor="fgender-man">男性</label>
                        <input
                            type="radio"
                            id="fgender-woman"
                            {...register("fgender", { required: true })}
                            value="2"
                        />
                        <label htmlFor="fgender-woman">女性</label>
                    </fieldset>
                </div>
                <div className="controls">
                    <input
                        id="fage"
                        type="number"
                        {...register("fage", {
                            required: "年齢は必須です。",
                            min: {
                                value: 0,
                                message: "年齢を正しく入力してください。",
                            },
                            pattern: {
                                value: /[0-9]+/,
                                message:
                                    "年齢を正しく入力してください（数字のみ）。",
                            },
                        })}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                    />
                    <label htmlFor="fage">ご年齢:</label>
                    {errors?.fage && <p role="alert">{errors.fage.message}</p>}
                </div>
                <div className="controls">
                    <input
                        type="text"
                        id="faddress"
                        {...register("faddress", {
                            required: "住所は必須です。",
                            maxLength: {
                                value: 100,
                                message: "住所は100文字以内で入力してください。",
                            },
                        })}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                    />
                    <label htmlFor="faddress">ご住所:</label>
                    {errors?.faddress && (
                        <p role="alert">{errors.faddress.message}</p>
                    )}
                </div>
                <div className="controls">
                    <textarea
                        id="fmessage"
                        {...register("fmessage", {
                            required: "ご意見を入力してください。",
                            maxLength: {
                                value: 2000,
                                message: "ご意見は1～2000文字で入力してください。",
                            },
                        })}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                    />
                    <label htmlFor="fmessage">ご意見:</label>
                    {errors?.fmessage && (
                        <p role="alert">{errors.fmessage.message}</p>
                    )}
                </div>
                <br />
                <br />
                <div className="controls gapped-inlines">
                    <input
                        type="submit"
                        id="fbutton"
                        name="fbutton"
                        value="Submit"
                    />
                    <input type="button" value="Reset" onClick={() => reset()} />
                </div>
            </form>
            <Prompt
                when={isDirty && (!onSubmitting)}
                message={location =>
                    `フォームに入力中です。${location.pathname}に移動しますか？`
                }
            />
        </>
    );
}
