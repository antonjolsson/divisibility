import React, {createContext, ReactElement, SetStateAction, useContext, useEffect, useRef, useState} from 'react';
import './App.css';
import {ExplanationWindow} from "./ExplanationWindow";

const BackgroundClickedContext = createContext({bgClicked: false, setBgClicked: (v: SetStateAction<boolean>) => {}})
const ShowExplanationContext = createContext({showExplanation: false, setShowExplanation: (v: SetStateAction<boolean>) => {}})
const InfoButtonCoordsContext = createContext({infoButtonCoords: {x: -1, y: -1},
        setInfoButtonCoords: (v: SetStateAction<{x: number, y: number}>) => {}})
const ExplainedRuleContext = createContext({rule: {number: -1, name: '', divides: false}, setRule: (v: SetStateAction<IRule>) => {}})

function TableRow(props: { entries: string[], marked: boolean, markedRank: number }): ReactElement {
    const infoButtonRef = useRef<HTMLImageElement>(null)
    const bgClickedContext = useContext(BackgroundClickedContext)
    const showExplanationContext = useContext(ShowExplanationContext)
    const explanationCoordsContext = useContext(InfoButtonCoordsContext)
    const {setRule} = useContext(ExplainedRuleContext)

    useEffect(() => {
        console.log(showExplanationContext.showExplanation)
        if (bgClickedContext.bgClicked/* && showExplanationContext.showExplanation*/) {
            showExplanationContext.setShowExplanation(false)
            bgClickedContext.setBgClicked(false)
        }
    }, [bgClickedContext])

    function onInfoButtonClick(e: React.MouseEvent<HTMLImageElement>): void {
        showExplanationContext.setShowExplanation(true)
        const rect = infoButtonRef.current?.getBoundingClientRect() ?? {x: -1, y: -1}
        explanationCoordsContext.setInfoButtonCoords({x: rect.x, y: rect.y})
        setRule({number: parseInt(props.entries[0]), name: props.entries[1], explanation: props.entries[2], divides: true})
        e.stopPropagation()
    }

    return <div className={'table-row'}>
        {props.marked && <img className={`stroke ${props.marked ? '' : 'reverse-anim'}`} src={'stroke.svg'} alt={'stroke'}
              id={`stroke${props.markedRank}`}></img>}
        <h2 className={'divisor'}>{props.entries[0]}</h2>
        <div className={'rule'}>
            <h2>{props.entries[1]}</h2>
            {props.markedRank > -1 &&
                <img ref={infoButtonRef} id={`info-button${props.markedRank}`} src={'info.svg'} alt={'info'}
                     onClick={(e): void => onInfoButtonClick(e)}></img>}
        </div>
        <h2 className={'divisible'}>{props.entries[3]}</h2>
    </div>;
}

function getDigitSum(number: number): number {
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

function divisibleBy11(number: number): boolean {
    let tries = 0
    while (number > 11 && tries++ < 100) {
        number = getNumberAsDigits(number)
            .reduce((acc, curr, i) => {
                if (i === 0) return acc
                if (i % 2 === 0) return acc + curr
                return acc - curr
            }) // Alternating sum!
    }
    return [0, 11].includes(number);
}

function divisibleBy4(number: number): boolean {
    return isEvenLongVersion(getNLastDigits(number, 2) / 2);
}

function divisibleBy7(number: number): boolean {
    do {
        const last = getNLastDigits(number, 1)
        const rest = Math.trunc(number / 10)
        number = 5 * last + rest;
    } while (number > 98)
    return number % 7 === 0
}

export interface IRule {
    number: number,
    name: string,
    explanation: string
    divides: boolean
}

function Table(props: {number: number}): ReactElement {
    const [isDivisibleByOne, setIsDivisibleByOne] =  useState(false)
    const [markedEntries, setMarkedEntries] = useState<IRule[]>([])

    useEffect(() => {
        setIsDivisibleByOne(false)
        setTimeout(() => setIsDivisibleByOne(true), 5)
        setMarkedEntries(rules.filter(e => e.divides))
        console.log(rules.filter(e => e.divides))
    }, [props.number])

    const rules: IRule[] = [
        {number: 1, name: 'Everything', explanation: '', divides: isDivisibleByOne},
        {number: 2,
            name: 'Even',
            explanation: `A non-negative integer is even if it ends in <b>0, 2, 4, 6</b> or <b>8</b>`,
            divides: isEvenLongVersion(props.number)},
        {number: 3, name: 'Digit sum', explanation: '', divides: getDigitSum(props.number) % 3 === 0},
        {number: 4, name: 'Last two digits', explanation: '', divides: divisibleBy4(props.number)},
        {number: 5, name: 'End in 0 or 5', explanation: '', divides: [0, 5].includes(getNLastDigits(props.number, 1))},
        {number: 6, name: 'Divisible by 2 and 3', explanation: '', divides: isEvenLongVersion(props.number) && getDigitSum(props.number) % 3 === 0},
        {number: 7, name: '5 x last + rest', explanation: '', divides: divisibleBy7(props.number)},
        {number: 8, name: 'Last 3 digits', explanation: '', divides: isEvenLongVersion(getNLastDigits(props.number, 3) / 2 / 2)},
        {number: 9, name: 'Digit sum', explanation: '', divides: getDigitSum(props.number) % 9 === 0},
        {number: 10, name: 'End in 0', explanation: '', divides: getNLastDigits(props.number, 1) === 0},
        {number: 11, name: 'Alternating sum', explanation: '', divides: divisibleBy11(props.number)},
        {number: 12, name: 'Divisible by 3 and 4', explanation: '', divides: getDigitSum(props.number) % 3 === 0 && divisibleBy4(props.number)}
    ]

    return <div id={'table'}>
        {Array(rules.length + 1).fill(null).map((_, i) => {
            const ruleIndex = i - 1
            return <TableRow key={i} marked={i > 0 && rules[ruleIndex].divides}
                             markedRank={ruleIndex >= 0 ? markedEntries.findIndex(e => e.number === rules[ruleIndex].number) : -1}
                             entries={i === 0 ? ['divisor', 'rule', '', 'divisible'] :
                                 [rules[ruleIndex].number, rules[ruleIndex].name, rules[ruleIndex].explanation,
                                     rules[ruleIndex].divides].map(v => String(v))}/>
        })}
    </div>;
}

function Input(props: {onChange: (n: number) => void}): ReactElement {
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            props.onChange(parseInt(inputRef.current.value))
        }
    }, [])
    return <div id={'number-input'}>
        <label>Number to test</label>
        <input ref={inputRef} type={'number'} defaultValue={10}
               onChange={(e): void => props.onChange(parseInt(e.target.value))}/>
    </div>;
}

function App(): ReactElement {
    const [dividend, setDividend] = useState(-1)
    const [bgClicked, setBgClicked] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [infoButtonCoordsForRule, setInfoButtonCoordsForRule] = useState({x: -1, y: -1})
    const [ruleExplained, setRuleExplained] = useState({number: -1, name: '', explanation: '', divides: false})

  return (
      <>
          <BackgroundClickedContext.Provider value={{bgClicked, setBgClicked}}>
              <ShowExplanationContext.Provider value={{showExplanation, setShowExplanation}}>
                  <InfoButtonCoordsContext.Provider value={{infoButtonCoords: infoButtonCoordsForRule,
                      setInfoButtonCoords: setInfoButtonCoordsForRule}}>
                      <ExplainedRuleContext.Provider value={{rule: ruleExplained, setRule: setRuleExplained}}>
                          <div className="App" onClick={(): void => {
                              console.log('bg clicked')
                              setBgClicked(true)
                          }}>
                              <img id={'bg'} src={'bg.jpg'} alt={'bg'}/>
                              <h1>Divisibility</h1>
                              <h3>Memorable shortcuts for testing divisibility by natural numbers up to 12</h3>
                              <Input onChange={(n: number): void => setDividend(n)}/>
                              <Table number={dividend}/>
                              {showExplanation && <ExplanationWindow coords={infoButtonCoordsForRule} rule={ruleExplained}
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
