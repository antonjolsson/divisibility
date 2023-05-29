import React, {ReactElement} from "react";
import {getAlternatingSum, getDigitSum, IRule} from "./App";
import './ExplanationWindow.css'

function LastNDigits(props: {dividend: number, divides: boolean, digits: number}): ReactElement {
    const dividends = [props.dividend]
    let dividend = props.dividend
    let digits = props.digits
    while (digits > 1) {
        dividend = Math.floor(dividend / 2)
        dividends.push(dividend)
        digits--
    }
    const lastDividendString = String(dividend)
    const firstDigits = lastDividendString.split('').slice(0, lastDividendString.length - 1)
    const lastDigit = lastDividendString.split('').at(-1)

    console.log(dividends)

    return <div id={'demonstrationLastNDigits'}>
    {dividends.map((v, i, arr) => i < arr.length - 1
        ? <h1 key={i} id={`row${i}`} className={'division-row'}>{v}
            <span>/ 2 = </span>
            <span>{arr[i + 1]}</span>
        </h1>
        : <h1 key={i} id={`row${i}`}
              className={'demonstrationLastDigit ' + (props.divides ? 'divisor' : 'not-divisor')}>{firstDigits}
            <span>{lastDigit}</span>
        </h1>)}
    </div>
}

function Demonstration1(props: { divides: boolean, dividend: number }): ReactElement {
    return <h1 id={'demonstration1'} className={props.divides ? 'divisor' : 'not-divisor'}>
        <span>{props.dividend}</span>
    </h1>;
}

function DigitSum(props: { divides: boolean, dividend: number, alternating: boolean, divisor: number }): ReactElement {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    const sums : number[] = []
    let dividend = props.dividend
    sums.push(dividend)
    while (dividend > 9 && dividend > props.divisor) {
        const sum = props.alternating
            ? getAlternatingSum(dividend, (number, tries) => number > props.divisor && tries < 100)
            : getDigitSum(dividend)
        sums.push(sum)
        dividend = sum
    }

    function getOperator(i: number, digits: string[]): string {
        if (i < digits.length - 1) {
            return (props.alternating && i % 2 === 0) ? '-' : '+'
        }
        return '='
    }

    function addOperators(digits: string[]): string[] {
        // Alternate digits with operators unless number less than 10 or dividend
        return (digits.length === 1 || parseInt(digits.join('')) <= props.divisor)? digits :
            digits.map((str, i) => [str].concat([getOperator(i, digits)])).flat()
    }

    function getChars(sum: number): string[] {
        const string = String(sum)
        return (sum < 9 || sum <= props.divisor) ? [string] : string.split('')
    }

    return <div id={'demonstrationDigitSum'}>
        {/* Need to reverse the array and ID:s to keep scrollbar scrolled to the bottom during animations */}
        {sums.reverse().map((sum, i, arr) => <h1 key={i} className={props.divides ? 'divisor' : 'not-divisor'}
                                                 id={'row' + String(arr.length - 1 - i)}>
            {addOperators(getChars(sum)).map((v, i) => <span key={i} className={i % 2 === 1 ? 'operator' : 'digit'}>{v}</span>)}
        </h1>)}
    </div>;
}

function getDemonstration(ruleNumber: number, dividend: number, divides: boolean): ReactElement {
    switch (ruleNumber) {
        case 1: return <Demonstration1 dividend={dividend} divides={divides}/>
        case 4: return <LastNDigits dividend={dividend} divides={divides} digits={2}/>
        case 3: case 9: case 11: return <DigitSum dividend={dividend} divides={divides} alternating={ruleNumber === 11}
                                                  divisor={ruleNumber}/>
        case 8: return <LastNDigits dividend={dividend} divides={divides} digits={3}/>
        default: return <LastNDigits dividend={dividend} divides={divides} digits={1}/>
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
