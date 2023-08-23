import React, {createContext, ReactElement, SetStateAction, useContext, useEffect, useRef, useState} from 'react';
import './App.css';
import {ExplanationWindow} from "./ExplanationWindow";
import {Credits} from "./Credits";
import {
    divisibleBy11,
    divisibleBy4,
    divisibleBy7,
    getDigitSum,
    getNLastDigits,
    IRule,
    isEvenLongVersion
} from "./Logic";
import {Header} from "./Header";
import {Input} from "./Input";

export const DEFAULT_DIVIDEND = 676 // 999999

export const BackgroundClickedContext = createContext({bgClicked: false, setBgClicked: (v: SetStateAction<boolean>) => {}})
const ShowExplanationContext = createContext({showExplanation: false, setShowExplanation: (v: SetStateAction<boolean>) => {}})
const InfoButtonCoordsContext = createContext({infoButtonCoords: {x: -1, y: -1},
        setInfoButtonCoords: (v: SetStateAction<{x: number, y: number}>) => {}})
const ExplainedRuleContext = createContext({rule: {divisor: -1, name: '', divides: [false]}, setRule: (v: SetStateAction<IRule>) => {}})

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
        setRule({divisor: parseInt(props.entries[0]), name: props.entries[1], explanation: props.entries[2],
            divides: props.entries.slice(3).map(v => v === 'true')})
        e.stopPropagation()
    }

    return <div className={'table-row'}>
        {props.marked && <img className={`stroke ${props.marked ? '' : 'reverse-anim'}`} src={'stroke-green.svg'}
                              alt={`stroke${props.entries[0]}`} id={`stroke${props.markedRank}`}></img>}
        <h2 className={'divisor'}>{props.entries[0]}</h2>
        <div className={'rule'}>
            <h2>{props.entries[1]}</h2>
            {parseInt(props.entries[0]) > 0 && <img ref={infoButtonRef} id={`info-button${props.entries[0]}`}
                                    src={'info.svg'} alt={`info${props.entries[0]}`} onClick={(e): void => onInfoButtonClick(e)}></img>}
        </div>
        <h2 className={'divisible'}>{props.entries[3]}</h2>
    </div>;
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
            divides: [isDivisibleByOne]
        },
        {
            divisor: 2,
            name: 'Even last digit',
            explanation: `An integer is even if it ends in <b>0, 2, 4, 6</b> or <b>8</b>`,
            divides: [isEvenLongVersion(props.number)]
        },
        {
            divisor: 3,
            name: 'Digit sum',
            explanation: 'An integer is divisible by 3 if the sum of its digits is',
            divides: [getDigitSum(props.number) % 3 === 0]
        },
        {
            divisor: 4,
            name: 'Last two digits',
            explanation: 'An integer is divisible by 4 if the last 2 digits are (can be divided by 2 and then checked if even)',
            divides: [divisibleBy4(props.number)]
        },
        {
            divisor: 5,
            name: 'End in 0 or 5',
            explanation: 'An integer is divisible by 5 if it ends in 0 or 5',
            divides: [[0, 5].includes(getNLastDigits(props.number, 1))]
        },
        {
            divisor: 6,
            name: 'Divisible by 2 and 3',
            explanation: 'An integer is divisible by 6 if it\'s divisible by 2 and 3 (check rules for those)',
            divides: [isEvenLongVersion(props.number), getDigitSum(props.number) % 3 === 0]
        },
        {
            divisor: 7,
            name: '5 x last + rest',
            explanation: 'An integer is divisible by 7 if 5 x its last digit + the rest is',
            divides: [divisibleBy7(props.number)]
        },
        {
            divisor: 8,
            name: 'Last 3 digits',
            explanation: 'An integer is divisible by 8 if the last 3 digits are (can be divided by 2, twice, and then checked if even)',
            divides: [isEvenLongVersion(getNLastDigits(props.number, 3) / 2 / 2)]
        },
        {
            divisor: 9,
            name: 'Digit sum',
            explanation: 'An integer is divisible by 9 if the sum of its digits is',
            divides: [getDigitSum(props.number) % 9 === 0]
        },
        {
            divisor: 10,
            name: 'End in 0',
            explanation: 'An integer is divisible by 10 if ends with 0',
            divides: [getNLastDigits(props.number, 1) === 0]
        },
        {
            divisor: 11,
            name: 'Alternating sum',
            explanation: 'An integer is divisible by 11 if its alternating sum (alternatingly - and +) is',
            divides: [divisibleBy11(props.number)]
        },
        {
            divisor: 12,
            name: 'Divisible by 3 and 4',
            explanation: 'An integer is divisible by 12 if it\'s divisible by 3 and 4 (check rules for those)',
            divides: [getDigitSum(props.number) % 3 === 0, divisibleBy4(props.number)]
        }
    ]

    return <div id={'table'}>
        {Array(rules.length + 1).fill(null).map((_, i) => {
            const ruleIndex = i - 1
            return <TableRow key={i} marked={i > 0 && rules[ruleIndex].divides.every(divides => divides)}
                             markedRank={ruleIndex >= 0 ? markedEntries.findIndex(e => e.divisor === rules[ruleIndex].divisor) : -1}
                             entries={i === 0 ? ['divisor', 'rule', '', 'divisible'] :
                                 [rules[ruleIndex].divisor, rules[ruleIndex].name, rules[ruleIndex].explanation,
                                     ...rules[ruleIndex].divides].map(v => String(v))}/>
        })}
    </div>;
}

function App(): ReactElement {
    const [dividend, setDividend] = useState(-1)
    const [bgClicked, setBgClicked] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [infoButtonCoordsForRule, setInfoButtonCoordsForRule] = useState({x: -1, y: -1})
    const [ruleExplained, setRuleExplained] = useState({divisor: -1, name: '', explanation: '', divides: [false]})

  return (
      <>
          <BackgroundClickedContext.Provider value={{bgClicked, setBgClicked}}>
              <ShowExplanationContext.Provider value={{showExplanation, setShowExplanation}}>
                  <InfoButtonCoordsContext.Provider value={{
                      infoButtonCoords: infoButtonCoordsForRule,
                      setInfoButtonCoords: setInfoButtonCoordsForRule
                  }}>
                      <ExplainedRuleContext.Provider value={{rule: ruleExplained, setRule: setRuleExplained}}>
                          <div className="app" onClick={(): void => {
                              setBgClicked(true)
                          }}>
                              <Header />
                              <Input onChange={(n: number): void => setDividend(n)}/>
                              <Table number={dividend}/>
                              {<ExplanationWindow show={showExplanation} coords={infoButtonCoordsForRule}
                                                  rule={ruleExplained}
                                                  dividend={dividend}/>}
                              <Credits/>
                          </div>
                      </ExplainedRuleContext.Provider>
                  </InfoButtonCoordsContext.Provider>
              </ShowExplanationContext.Provider>
          </BackgroundClickedContext.Provider>
      </>
  );
}

export default App;
