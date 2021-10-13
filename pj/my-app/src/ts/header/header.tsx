import React from 'react'
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header>
            <h1>Header</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/opinion-form">ご意見フォーム</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}