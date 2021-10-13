import {
    render,
    screen,
    RenderResult,
    fireEvent,
} from "@testing-library/react";
import App from "./App";
import { MemoryRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

const getByTextWithMarkup = (text: string) => {
    return screen.getByText((content, node) => {
        if (!(node instanceof HTMLElement)) return false;
        const hasText = (node: HTMLElement) => node.textContent === text;
        const childrenDontHaveText = Array.from(node.children).every(
            child => !hasText(child as HTMLElement)
        )
        return hasText(node) && childrenDontHaveText
    })
}

function WrappedApp() {
    return (
        <MemoryRouter initialEntries={["/"]}>
            <App />
        </MemoryRouter>
    );
}

describe("App", () => {

    describe('page transition', () => {
        let renderResult: RenderResult;

        beforeEach(() => {
            renderResult = render(<WrappedApp />);
        });

        afterEach(() => {
            renderResult.unmount();
        });

        it('should open home page', () => {
            expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
        });

        it('should open opinion form page', () => {
            fireEvent.click(screen.getByRole("link", { name: "Home" }));

            expect(screen.getByText("ご意見フォーム")).toBeInTheDocument();
        });

    });

    it('should open custon 404 page', () => {
        const history = createMemoryHistory();
        history.push("/something-else");
        render(
            <Router history={history}>
                <App />
            </Router>,
        );
        expect(getByTextWithMarkup("No match for '/something-else'")).toBeInTheDocument();
    });

    it('should redirect to home when result-page directly opened', () => {
        const history = createMemoryHistory();
        history.push("/result");
        render(
            <Router history={history}>
                <App />
            </Router>,
        );
        expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    });

});
