import React, {ReactElement} from "react";
import {IRule} from "./App";

function Demonstration2(props: {dividend: number}): ReactElement {
    const dividendString = String(props.dividend)
    const firstDigits = dividendString.split('').slice(0, dividendString.length - 1)
    const lastDigit = dividendString.split('').at(-1)
    return <h1 id={'demonstration2'}>{firstDigits}<span>{lastDigit}</span></h1>;
}

function getDemonstration(ruleNumber: number, dividend: number): ReactElement {
    return <Demonstration2 dividend={dividend}/>
}

export function ExplanationWindow(props: { coords: { x: number; y: number }, rule: IRule, dividend: number }): ReactElement {
    function stopPropagation(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
    }

    return <div id={'expl-window-container'} style={{left: props.coords.x, top: props.coords.y}}>
        <div id={'expl-window-bg'}></div>
        <div onClick={(e): void => stopPropagation(e)} id={'expl-window'}>
            <h2 id={'headline'}>{props.rule.name}</h2>
            <div id={'explanation'} dangerouslySetInnerHTML={{ __html: props.rule.explanation }}/>
            {getDemonstration(props.rule.number, props.dividend)}
        </div>
    </div>;
}
