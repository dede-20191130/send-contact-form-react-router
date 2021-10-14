import { Route } from 'react-router-dom'
import { SubmitIndicator } from '../../result-page/submit-indicator'

export function DevResultDummyData() {
    const dummySetter = (b: boolean) => null;
    return (
        <Route path="/devresult">
            <SubmitIndicator
                formValues={{
                    name: "dummy name",
                    gender: "1",
                    age: "20",
                    address: "愛知県豊田市上仁木町1-11-5 上仁木町ハイム 4階",
                    message: 
                        "test comment.\n"
                        +"test comment.test comment.\n"
                        +"test comment.test comment.test comment.\n",
                }}
                setIsSubmitted={dummySetter as any}
            />
        </Route>
    )
}