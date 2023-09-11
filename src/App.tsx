import React, {createContext, ReactElement, SetStateAction, useState} from 'react';
import './App.scss';
import {ExplanationWindow} from "./ExplanationWindow";
import {Credits} from "./Credits";
import {IRule} from "./Logic";
import {Header} from "./Header";
import {Input} from "./Input";
import {Table} from "./Table";

// TODO: Everything (mobile) - scrollbar on stroke
// TODO: Last N Digits (mobile) - Height/position of SVG stroke
// TODO: Last Two Digits - doesn't work with odd numbers (doesn't show fraction)
// TODO: Last Two Digits, Last Three Digits - space after equal sign
// TODO: 5 x Last + Rest - stroke height

export const DEFAULT_DIVIDEND = 67677 // 676

export const BackgroundClickedContext = createContext({bgClicked: false, setBgClicked: (v: SetStateAction<boolean>) => {}})
export const ShowExplanationContext = createContext({showExplanation: false, setShowExplanation: (v: SetStateAction<boolean>) => {}})
export const InfoButtonCoordsContext = createContext({infoButtonCoords: {x: -1, y: -1},
        setInfoButtonCoords: (v: SetStateAction<{x: number, y: number}>) => {}})
export const ExplainedRuleContext = createContext({rule: {divisor: -1, name: '', divides: [false]}, setRule: (v: SetStateAction<IRule>) => {}})

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
