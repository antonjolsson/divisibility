import React, {createContext, ReactElement, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {BackgroundClickedContext} from "./App";
import {IRule} from "./Logic";
import './ExplanationWindow.scss'
import {get5XLastPlusRest, getAlternatingSum, getDigitSum} from "./Logic";

export const DemosFinishedContext = createContext({finished: 0, setFinished: (v: SetStateAction<number>) => {}})

// Demonstrates rules for 2, 4, 8, 10
function LastNDigits(props: {dividend: number, divides: boolean, digits: number, className?: string}): ReactElement {
    const demosFinishedContext = useContext(DemosFinishedContext)
    const className = props.digits > 1 ? ' multi-row' : ''

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

    function onAnimationEnd(i: number, arr: number[]): void {
        if (i === arr.length - 1) {
            demosFinishedContext.setFinished(demosFinishedContext.finished + 1)
        }
    }

    return <div id={'demonstration-last-n-digits'} className={props.className ?? ''}>
    {dividends.map((v, i, arr) => i < arr.length - 1
        ? <h1 key={i} id={`row${i}`} className={'division-row' + className}>{v}
            <span>/ 2 = </span>
            <span>{arr[i + 1]}</span>
        </h1>
        : <h1 key={i} id={`row${i}`}
              className={'demonstration-last-digit ' + (props.divides ? 'divisor' : 'not-divisor') + className}>{firstDigits}
            <div id={'stroke-container'} className={firstDigits.length > 0 ? 'multi-digit' : ''}>
                <div id={'bg-stroke'} onAnimationEnd={(): void => onAnimationEnd(i, arr)}/>
                <span id={firstDigits.length === 0 ? 'sole-digit' : ''}>{lastDigit}</span>
            </div>
        </h1>)}
    </div>
}

// Rule for 1
function Demo1(props: { divides: boolean, dividend: number, className?: string }): ReactElement {
    return <div id={'demonstration1'}>
                <h1 id='row0' className={`${props.className ?? ''} ${props.divides ? 'divisor' : 'not-divisor'}`}>
                    <div id={'stroke-container'}>
                        {props.dividend < 10000 // Only use SVG for long strokes
                            ? <div id={'bg-stroke'}/>
                            : <img className={'stroke'} src={'stroke-green.svg'} alt={'stroke'}/>}
                        <span>{props.dividend}</span>
                    </div>
                </h1>
    </div>;
}

function getScrollInterval(containerRef?: React.RefObject<HTMLDivElement>): NodeJS.Timer {
    return setInterval(() => {
        const container = containerRef?.current
        if (container) {
            container.scroll(0, container.scrollHeight)
        }
    }, 10);
}

// Rules for 3, 9, 11
function DigitSum(props: { divides: boolean, dividend: number, alternating: boolean, divisor: number,
    className?: string }): ReactElement {
    const demosFinishedContext = useContext(DemosFinishedContext)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollInterval = useRef()

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

    /*useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scroll(0, 0)
        }
    }, [containerRef]);*/

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

    function onAnimationEnd(i: number, lines: number): void {
        if (i === lines - 1) {
           demosFinishedContext.setFinished(demosFinishedContext.finished + 1)
        }
        clearInterval(scrollInterval.current)
    }

    useEffect(() => {
        if (!props.className?.includes('child') && !scrollInterval.current) {
            (scrollInterval.current as unknown as NodeJS.Timer) = getScrollInterval(containerRef)
        }
    }, [props.className])

    return <div id={'demonstration-digit-sum'} className={props.className ?? ''} ref={containerRef}>
        {sums.map((sum, i, arr) => <h1 key={i} className={props.divides ? 'divisor' : 'not-divisor'}
                                                 id={'row' + String(i)}>
            {i === arr.length - 1 && <div id={'bg-stroke'} onAnimationEnd={(_): void => onAnimationEnd(i, arr.length)}/>}
            {addOperators(getChars(sum)).map((v, j) => <span key={j}
                className={(j % 2 === 1 ? 'operator' : 'digit') + (i === arr.length - 1 ? ' only-child' : '')}>{v}</span>)}
        </h1>)}
    </div>;
}

// Rule for 7
function Demo7(props: { divides: boolean, dividend: number, className?: string }): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollInterval = useRef()

    let dividend = props.dividend
    const dividends = [dividend]
    while (dividend > 98) {
        dividend = get5XLastPlusRest(dividend)
        dividends.push(dividend)
    }

    useEffect(() => {
        if (!scrollInterval.current) {
            (scrollInterval.current as unknown as NodeJS.Timer) = getScrollInterval(containerRef)
        }
    }, [props.className])

    return <div id={'demo7'} ref={containerRef}
        className={[dividends.length < 4 ? 'single-row' : '', props.className ?? '']
        .filter(str => str !== '')
        .join(' ')}>
        {dividends
            .map((dividend, i, arr) => {
                const id = 'row' + String(i)
                    return (i === arr.length - 1)
                        ? <h1 key={i} className={`demo-last-row ${props.divides ? 'divisor' : 'not-divisor'}`} id={id}>
                            <div id={'bg-stroke'} onAnimationEnd={(): void => clearInterval(scrollInterval.current)}/>
                            <span>{dividend}</span></h1>
                        : <h1 key={i} id={id}>
                            <span id={'left-most-digits'}>{String(dividend).slice(0, -1)}</span>
                            <span id={'hidden-equation-left-part'}> + 5 x </span>
                            <span id={'right-most-digit'}>{String(dividend).at(-1)}</span>
                            <span id={'hidden-equation-right-part'}>= {arr[i + 1]}</span>
                        </h1>
                }
            )}
    </div>
}

// Rule for 6, 12
function CompositeDemo(props: { divisor: number, divides: boolean[], dividend: number }): ReactElement {
    const demosFinishedContext = useContext(DemosFinishedContext)
    const divisors = props.divisor === 6 ? [2, 3] : [3, 4]
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollInterval = useRef()

    // We need to scroll programmatically here due to a bug related to CSS value justify-content: flex-end
    useEffect(() => {
        if (!scrollInterval.current) {
            (scrollInterval.current as unknown as NodeJS.Timer) = getScrollInterval(containerRef)
        }

        if (demosFinishedContext.finished === 2) {
            clearInterval(scrollInterval.current)
        }
    }, [demosFinishedContext.finished])

    return <div id={'composite-demo'} ref={containerRef}>
        {getDemonstration(divisors[0], props.dividend, [props.divides[0]], 'child')}
        {demosFinishedContext.finished > 0 && getDemonstration(divisors[1], props.dividend, [props.divides[1]], 'child')}
    </div>;
}

function getDemonstration(ruleNumber: number, dividend: number, divides: boolean[], className?: string): ReactElement {
    function getNumDigits4And8(): number {
        if (ruleNumber === 4) {
            // If odd number, don't demonstrate by dividing
            return dividend % 2 === 0 ? 2 : 1
        } // ruleNumber = 8, same check before each division
        if (dividend % 2 === 1) {
            return 1
        }
        if ((dividend / 2) % 2 === 0) {
            return 3
        }
        return 2
    }

    switch (ruleNumber) {
        case 1: return <Demo1 dividend={dividend} divides={divides[0]} className={className}/>
        case 4: return <LastNDigits dividend={dividend} divides={divides[0]} digits={getNumDigits4And8()}
                                    className={className}/>
        case 3: case 9: case 11: return <DigitSum dividend={dividend} divides={divides[0]} alternating={ruleNumber === 11}
                                divisor={ruleNumber} className={`${dividend < 10 ? 'single-row ' : ''}${className}`}/>
        case 6: case 12: return <CompositeDemo divisor={ruleNumber} dividend={dividend} divides={divides}/>
        case 7: return <Demo7 dividend={dividend} divides={divides[0]} className={className}/>
        case 8: return <LastNDigits dividend={dividend} divides={divides[0]}
                                    digits={getNumDigits4And8()} className={className + ' last-3-digits'}/>
        default: return <LastNDigits dividend={dividend} divides={divides[0]} digits={1} className={`single-row ${className}`}/>
    }
}

export function ExplanationWindow(props: { coords: { x: number; y: number }, rule: IRule, dividend: number,
    show: boolean }): ReactElement {
    const [show, setShow] = useState(false)
    const [rootClassName, setRootClassName] = useState('')
    const [demosFinished, setDemosFinished] =  useState(0)
    const bgClickedContext = useContext(BackgroundClickedContext)

    useEffect(() => {
        if (props.show) {
            setRootClassName('grow')
            setShow(true)
        } else {
            setRootClassName('fade-out')
            setTimeout(() => setShow(false), 500)
            setDemosFinished(0)
        }
    }, [props.show])

    function stopPropagation(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
    }

    return <>
        {show && <div id={'expl-window-container'} className={rootClassName}
                      style={{left: props.coords.x, top: props.coords.y}}>
            <div id={'expl-window-bg'}></div>
            <h2 id={'close-button'} onClick={(): void => bgClickedContext.setBgClicked(true)}>x</h2>
            <div id={'expl-window'} onClick={(e): void => stopPropagation(e)}>
                <h2 className={'headline-divisor'}><span>Divisor: </span>{`${props.rule.divisor}`}</h2>
                <h2 className={'headline-rule'}><span>Rule: </span>{`${props.rule.name}`}</h2>
                <div id={'explanation'} dangerouslySetInnerHTML={{__html: props.rule.explanation}}/>
                <DemosFinishedContext.Provider value={{finished: demosFinished, setFinished: setDemosFinished}}>
                {getDemonstration(props.rule.divisor, props.dividend, props.rule.divides)}
                </DemosFinishedContext.Provider>
            </div>
        </div>}
    </>
}
