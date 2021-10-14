import { Link } from 'react-router-dom';
import { DevResultLink } from '../dev/debug-utils/result-page-link'

export function Header() {
    return (
        <header className="nav-header">
            <h1>Header</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/opinion-form">ご意見フォーム</Link>
                    </li>
                    {(process.env.NODE_ENV === "development") && (
                        <li>
                            <DevResultLink />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}