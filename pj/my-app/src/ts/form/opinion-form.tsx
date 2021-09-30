import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface OpinionFormArgs {
    onSubmit: (data: IFormInput) => void
}

interface IFormInput {
    fname: string,
    fgender: string,
    fage: string,
    faddress: string,
    fmessage: string,
}
export function OpinionForm({ onSubmit }: OpinionFormArgs) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, submitCount },
        reset
    } = useForm<IFormInput>({
        criteriaMode: "all"
    });

    const onFormSubmit = (data: IFormInput) => {
        onSubmit(data);
    }

    // delete data after submission
    // https://codesandbox.io/s/react-hook-form-handlesubmit-with-reset-xu1zu?file=/src/index.js
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [submitCount, reset]);

    return (
        <form
            id="opinion-send" name="opinion-send" autoComplete="on"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <h2><span>ご意見フォーム</span></h2>
            <div className="controls">
                <input
                    id="fname"
                    type="text"
                    {...register("fname", {
                        required: true,
                        minLength: 1,
                        maxLength: 20
                    })}
                />
                <label htmlFor="fname">ご氏名: </label>
                {errors?.fname && <p role="alert">{errors.fname.message}</p>}
            </div>
            <div className="controls">

                <fieldset>
                    <legend>ご性別</legend>
                    <input
                        type="radio" id="fgender-other"
                        {...register("fgender", { required: true })}
                        value="0" checked
                    />
                    <label htmlFor="fgender-other">
                        その他
                    </label>
                    <input
                        type="radio" id="fgender-man"
                        {...register("fgender", { required: true })}
                        value="1"
                    />
                    <label htmlFor="fgender-man">
                        男性
                    </label>
                    <input
                        type="radio" id="fgender-woman"
                        {...register("fgender", { required: true })}
                        value="2"
                    />
                    <label htmlFor="fgender-woman">
                        女性
                    </label>
                </fieldset>
            </div>
            <div className="controls">
                <input
                    id="fage"
                    type="number"
                    {...register("fage", {
                        required: true,
                        min: 0,
                        pattern: /[0-9]+/
                    })}
                />
                <label htmlFor="fage">ご年齢:</label>
                {errors?.fage && <p role="alert">{errors.fage.message}</p>}

            </div>
            <div className="controls">
                <input
                    type="text" id="faddress"
                    {...register("faddress", {
                        required: true,
                        maxLength: 100,
                    })}
                />
                <label htmlFor="faddress">ご住所:</label>
                {errors?.faddress && <p role="alert">{errors.faddress.message}</p>}

            </div>
            <div className="controls">
                <textarea
                    id="fmessage"
                    {...register("fmessage", {
                        required: true,
                        maxLength: 2000,
                    })}
                />
                <label htmlFor="fmessage">ご意見:</label>
                {errors?.fmessage && <p role="alert">{errors.fmessage.message}</p>}

            </div>
            <div className="controls">
                <input type="button" id="fbutton" name="fbutton" value="Submit" />
                <input type="button" value="Reset" onClick={() => reset()} />
            </div>
        </form>
    );

}