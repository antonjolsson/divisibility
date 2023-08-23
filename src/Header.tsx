import React, {ReactElement} from "react";
import './Header.css'

export function Header(): ReactElement {
    return <header>
        <div className={'headline-container'}>
            <h1>Divisibility</h1>
            <img className={'stroke-underline'} src={'stroke-black.svg'} alt={'underline'}></img>
        </div>
        <h3>Memorable shortcuts for testing divisibility of integers</h3>
    </header>;
}
