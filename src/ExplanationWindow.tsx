import React, {ReactElement} from "react";
import {IRule} from "./App";

function Demonstration2(props: {dividend: number, divides: boolean}): ReactElement {
    const dividendString = String(props.dividend)
    const firstDigits = dividendString.split('').slice(0, dividendString.length - 1)
    const lastDigit = dividendString.split('').at(-1)
    return <h1 id={'demonstration2'} className={props.divides ? 'divisor' : 'not-divisor'}>{firstDigits}
        <span>{lastDigit}</span></h1>;
}

function Demonstration1(props: { divides: boolean, dividend: number }): ReactElement {
    return <h1 id={'demonstration1'} className={props.divides ? 'divisor' : 'not-divisor'}>
        <span>{props.dividend}</span>
    </h1>;
}

function getDigitSum(dividend: number): number {
    const digits = String(dividend).split('')
    return digits
        .map(str => parseInt(str))
        .reduce((p, c) => p + c)
}

function Demonstration3(props: { divides: boolean, dividend: number }): ReactElement {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    const sums : number[] = []
    let dividend = props.dividend
    sums.push(dividend)
    while (dividend > 10) {
        const sum = getDigitSum(dividend)
        sums.push(sum)
        dividend = sum
        console.log(sums)
    }
    console.log(sums)

    function addPluses(strings: string[]): string[] {
        return strings.length === 1 ? strings :
            strings.map((str, i) => [str].concat((i < strings.length - 1) ? ['+'] : ['='])).flat()
    }

    return <div id={'demonstration3'}>
        {/* Need to reverse the array and ID:s to keep scrollbar scrolled to the bottom during animations */}
        {sums.reverse().map((sum, i, arr) => <h1 key={i} className={props.divides ? 'divisor' : 'not-divisor'}
                                                 id={'row' + String(arr.length - 1 - i)}>
            {addPluses(String(sum).split('')).map((v, i) => <span key={i} className={i % 2 === 1 ? 'operator' : 'digit'}>{v}</span>)}
        </h1>)}
    </div>;
}

function getDemonstration(ruleNumber: number, dividend: number, divides: boolean): ReactElement {
    console.log(divides)
    switch (ruleNumber) {
        case 1: return <Demonstration1 dividend={dividend} divides={divides}/>
        case 3: return <Demonstration3 dividend={dividend} divides={divides}/>
        default: return <Demonstration2 dividend={dividend} divides={divides}/>
    }
}

export function ExplanationWindow(props: { coords: { x: number; y: number }, rule: IRule, dividend: number }): ReactElement {
    function stopPropagation(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
    }

    return <div id={'expl-window-container'} style={{left: props.coords.x, top: props.coords.y}}>
        <div id={'expl-window-bg'}></div>
        <div onClick={(e): void => stopPropagation(e)} id={'expl-window'}>
            <h2 className={'headline'}>{`Divisor: ${props.rule.divisor}`}</h2>
            <h2 className={'headline'}>{`Rule: ${props.rule.name}`}</h2>
            <div id={'explanation'} dangerouslySetInnerHTML={{ __html: props.rule.explanation }}/>
            {getDemonstration(props.rule.divisor, props.dividend, props.rule.divides)}
        </div>
    </div>;
}
