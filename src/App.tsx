import React, {createContext, ReactElement, SetStateAction, useContext, useEffect, useRef, useState} from 'react';
import './App.css';
import {ExplanationWindow} from "./ExplanationWindow";

const DEFAULT_DIVIDEND = 112

const BackgroundClickedContext = createContext({bgClicked: false, setBgClicked: (v: SetStateAction<boolean>) => {}})
const ShowExplanationContext = createContext({showExplanation: false, setShowExplanation: (v: SetStateAction<boolean>) => {}})
const InfoButtonCoordsContext = createContext({infoButtonCoords: {x: -1, y: -1},
        setInfoButtonCoords: (v: SetStateAction<{x: number, y: number}>) => {}})
const ExplainedRuleContext = createContext({rule: {divisor: -1, name: '', divides: false}, setRule: (v: SetStateAction<IRule>) => {}})

function TableRow(props: { entries: string[], marked: boolean, markedRank: number }): ReactElement {
    const infoButtonRef = useRef<HTMLImageElement>(null)
    const bgClickedContext = useContext(BackgroundClickedContext)
    const showExplanationContext = useContext(ShowExplanationContext)
    const explanationCoordsContext = useContext(InfoButtonCoordsContext)
    const {setRule} = useContext(ExplainedRuleContext)

    useEffect(() => {
        if (bgClickedContext.bgClicked) {
            showExplanationContext.setShowExplanation(false)
            bgClickedContext.setBgClicked(false)
        }
    }, [bgClickedContext])

    function onInfoButtonClick(e: React.MouseEvent<HTMLImageElement>): void {
        showExplanationContext.setShowExplanation(true)
        const rect = infoButtonRef.current?.getBoundingClientRect() ?? {x: -1, y: -1}
        explanationCoordsContext.setInfoButtonCoords({x: rect.x, y: rect.y})
        setRule({divisor: parseInt(props.entries[0]), name: props.entries[1], explanation: props.entries[2], divides: props.marked})
        e.stopPropagation()
    }

    return <div className={'table-row'}>
        {props.marked && <img className={`stroke ${props.marked ? '' : 'reverse-anim'}`} src={'stroke.svg'}
                              alt={`stroke${props.entries[0]}`} id={`stroke${props.markedRank}`}></img>}
        <h2 className={'divisor'}>{props.entries[0]}</h2>
        <div className={'rule'}>
            <h2>{props.entries[1]}</h2>
            {parseInt(props.entries[0]) > 0 && <img ref={infoButtonRef} id={`info-button${props.entries[0]}`} src={'info.svg'} alt={'info'}
                  onClick={(e): void => onInfoButtonClick(e)}></img>}
        </div>
        <h2 className={'divisible'}>{props.entries[3]}</h2>
    </div>;
}

export function getDigitSum(number: number): number {
    return String(number)
        .split('')
        .map(s => parseInt(s))
        .reduce((p, c) => p + c)
}

function isEvenLongVersion(n: number): boolean {
    const str = String(n)
    return [0, 2, 4, 6, 8].includes(parseInt(str[str.length - 1]));
}

function getNLastDigits(number: number, numOfDigits: number): number {
    return parseInt(String(number)
        .split('')
        .slice(-numOfDigits)
        .join(''))
}

function getNumberAsDigits(number: number): number[] {
    const str = String(number)
    return str.split('').map(s => parseInt(s));
}

export function getAlternatingSum(dividend: number,
                           continueCondition: (number: number, tries: number) => boolean): number {
    let tries = 0
    while (continueCondition(dividend, tries++)) {
        dividend = getNumberAsDigits(dividend)
            .reduce((acc, curr, i) => {
                if (i === 0) return acc
                if (i % 2 === 0) return acc + curr
                return acc - curr
            }) // Alternating sum!
    }
    return dividend;
}

function divisibleBy11(dividend: number): boolean {
    dividend = getAlternatingSum(dividend, (number: number, tries: number) => number > 11 && tries < 100);
    return [0, 11].includes(dividend);
}

function divisibleBy4(number: number): boolean {
    return isEvenLongVersion(getNLastDigits(number, 2) / 2);
}

export function get5XLastPlusRest(number: number): number {
    const last = getNLastDigits(number, 1)
    const rest = Math.trunc(number / 10)
    return 5 * last + rest;
}

function divisibleBy7(number: number): boolean {
    do {
        number = get5XLastPlusRest(number);
    } while (number > 98)
    return number % 7 === 0
}

export interface IRule {
    divisor: number,
    name: string,
    explanation: string
    divides: boolean
}

function Table(props: {number: number}): ReactElement {
    const [isDivisibleByOne, setIsDivisibleByOne] =  useState(true)
    const [markedEntries, setMarkedEntries] = useState<IRule[]>([])

    useEffect(() => {
        setIsDivisibleByOne(false)
        setTimeout(() => setIsDivisibleByOne(true), 5)
        setMarkedEntries(rules.filter(e => e.divisor === 1 || e.divides))
    }, [props.number])

    const rules: IRule[] = [
        {
            divisor: 1,
            name: 'Everything',
            explanation: 'Any integer is divisible by 1',
            divides: isDivisibleByOne
        },
        {
            divisor: 2,
            name: 'Even last digit',
            explanation: `An integer is even if it ends in <b>0, 2, 4, 6</b> or <b>8</b>`,
            divides: isEvenLongVersion(props.number)},
        {
            divisor: 3,
            name: 'Digit sum',
            explanation: 'An integer is divisible by 3 if the sum of its digits is',
            divides: getDigitSum(props.number) % 3 === 0
        },
        {
            divisor: 4,
            name: 'Last two digits',
            explanation: 'An integer is divisible by 4 if the last 2 digits are (can be divided by 2 and then checked if even)',
            divides: divisibleBy4(props.number)
        },
        {
            divisor: 5,
            name: 'End in 0 or 5',
            explanation: 'An integer is divisible by 5 if it ends in 0 or 5',
            divides: [0, 5].includes(getNLastDigits(props.number, 1))
        },
        {divisor: 6, name: 'Divisible by 2 and 3', explanation: '', divides: isEvenLongVersion(props.number) && getDigitSum(props.number) % 3 === 0},
        {
            divisor: 7,
            name: '5 x last + rest',
            explanation: 'An integer is divisible by 7 if 5 x its last digit + the rest is',
            divides: divisibleBy7(props.number)},
        {
            divisor: 8,
            name: 'Last 3 digits',
            explanation: 'An integer is divisible by 8 if the last 3 digits are (can be divided by 2, twice, and then checked if even)',
            divides: isEvenLongVersion(getNLastDigits(props.number, 3) / 2 / 2)
        },
        {
            divisor: 9,
            name: 'Digit sum',
            explanation: 'An integer is divisible by 9 if the sum of its digits is',
            divides: getDigitSum(props.number) % 9 === 0
        },
        {
            divisor: 10,
            name: 'End in 0',
            explanation: 'An integer is divisible by 10 if ends with 0',
            divides: getNLastDigits(props.number, 1) === 0
        },
        {
            divisor: 11,
            name: 'Alternating sum',
            explanation: 'An integer is divisible by 11 if its alternating sum (alternatingly - and +) is',
            divides: divisibleBy11(props.number)
        },
        {divisor: 12, name: 'Divisible by 3 and 4', explanation: '', divides: getDigitSum(props.number) % 3 === 0 && divisibleBy4(props.number)}
    ]

    return <div id={'table'}>
        {Array(rules.length + 1).fill(null).map((_, i) => {
            const ruleIndex = i - 1
            return <TableRow key={i} marked={i > 0 && rules[ruleIndex].divides}
                             markedRank={ruleIndex >= 0 ? markedEntries.findIndex(e => e.divisor === rules[ruleIndex].divisor) : -1}
                             entries={i === 0 ? ['divisor', 'rule', '', 'divisible'] :
                                 [rules[ruleIndex].divisor, rules[ruleIndex].name, rules[ruleIndex].explanation,
                                     rules[ruleIndex].divides].map(v => String(v))}/>
        })}
    </div>;
}

function Input(props: {onChange: (n: number) => void}): ReactElement {
    const maxValue = 999999
    const minValue = 0
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            props.onChange(parseInt(inputRef.current.value))
        }
    }, [])

    function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = parseInt(e.target.value)
        if (value > maxValue) {
            e.target.value = String(maxValue)
        } else if (value < minValue) {
            e.target.value = String(minValue)
        }
        props.onChange(value);
    }

    return <><label>Number to test
            <input ref={inputRef} type={'number'} defaultValue={DEFAULT_DIVIDEND} maxLength={6} max={maxValue} min={minValue}
                   onChange={(e): void => onChange(e)}/>
        </label></>
}

function App(): ReactElement {
    const [dividend, setDividend] = useState(-1)
    const [bgClicked, setBgClicked] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [infoButtonCoordsForRule, setInfoButtonCoordsForRule] = useState({x: -1, y: -1})
    const [ruleExplained, setRuleExplained] = useState({divisor: -1, name: '', explanation: '', divides: false})

  return (
      <>
          <BackgroundClickedContext.Provider value={{bgClicked, setBgClicked}}>
              <ShowExplanationContext.Provider value={{showExplanation, setShowExplanation}}>
                  <InfoButtonCoordsContext.Provider value={{infoButtonCoords: infoButtonCoordsForRule,
                      setInfoButtonCoords: setInfoButtonCoordsForRule}}>
                      <ExplainedRuleContext.Provider value={{rule: ruleExplained, setRule: setRuleExplained}}>
                          <div className="App" onClick={(): void => {
                              setBgClicked(true)
                          }}>
                              <img id={'bg'} src={'bg.jpg'} alt={'bg'}/>
                              <h1>Divisibility</h1>
                              <h3>Memorable shortcuts for testing divisibility by natural numbers up to 12</h3>
                              <Input onChange={(n: number): void => setDividend(n)}/>
                              <Table number={dividend}/>
                              {<ExplanationWindow show={showExplanation} coords={infoButtonCoordsForRule} rule={ruleExplained}
                                                                     dividend={dividend}/>}
                          </div>
                      </ExplainedRuleContext.Provider>
                  </InfoButtonCoordsContext.Provider>
              </ShowExplanationContext.Provider>
          </BackgroundClickedContext.Provider>
      </>
  );
}

export default App;
