import { useState, useCallback } from "react";
import { OpinionForm, IFormInput } from "./form/opinion-form";
import { Modalizer } from "./modal/modalizer";
import {
    SubmitIndicator,
    accepttedContentData,
} from "./modal/submit-indicator";

function App() {
    const [isShowModal, setIsShowModal] = useState(false);
    const [formValues, setFormValues] = useState<accepttedContentData>(
        {} as accepttedContentData
    );
    const [activeElementStocked, setActiveElementStocked] =
        useState<HTMLElement | null>(null);

    const modalContainer = document.getElementById("modal-root");

    const onSubmit = useCallback(
        (data: IFormInput) => {
            setFormValues({
                name: data.fname,
                gender: data.fgender,
                age: data.fage,
                address: data.faddress,
                message: data.fmessage,
            });

            setIsShowModal(true);
            if (document.activeElement instanceof HTMLElement) {
                setActiveElementStocked(document.activeElement);
            }
        },
        [setIsShowModal]
    );

    const onCloseModal = useCallback(() => {
        setIsShowModal(false);
        activeElementStocked?.focus();
    }, [setIsShowModal, activeElementStocked]);

    return (
        <>
            <div id="temp-page-top" style={{ marginBottom: "50px" }}>
                {" "}
            </div>
            <div className="normal-form-container">
                <OpinionForm onSubmit={onSubmit}></OpinionForm>
            </div>
            {isShowModal && modalContainer && (
                <Modalizer modalContainer={modalContainer}>
                    <SubmitIndicator
                        formValues={formValues}
                        onCloseModal={onCloseModal}
                    />
                </Modalizer>
            )}
        </>
    );
}

export default App;
