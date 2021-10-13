import { useState, useCallback } from "react";
import { Switch, Route, Redirect } from 'react-router-dom'
import { Header } from './header/header'
import { Footer } from './header/footer'
import { Home } from './home/home'
import { OpinionForm, IFormInput } from "./form/opinion-form";
import {
    SubmitIndicator,
    accepttedContentData,
} from "./result-page/submit-indicator";
import { NoMatch } from './error-pages/nomatch'

function App() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formValues, setFormValues] = useState<accepttedContentData>(
        {} as accepttedContentData
    );
    const handleSubmit = useCallback(
        (data: IFormInput) => {
            setFormValues({
                name: data.fname,
                gender: data.fgender,
                age: data.fage,
                address: data.faddress,
                message: data.fmessage,
            });

            setIsSubmitted(true);
        },
        [setIsSubmitted]
    );

    return (
        <>
            <Header />
            <main>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/opinion-form">
                        <div className="normal-form-container">
                            <OpinionForm onSubmit={handleSubmit}></OpinionForm>
                        </div>
                    </Route>
                    <Route path="/result">
                        {isSubmitted ? (
                            <SubmitIndicator
                                formValues={formValues}
                                setIsSubmitted={setIsSubmitted}
                            />
                        ) : (
                            <Redirect to="/" />
                        )}
                    </Route>
                    {/* 404 error page */}
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>
            </main>
            <Footer />
        </>
    );
}

export default App;
