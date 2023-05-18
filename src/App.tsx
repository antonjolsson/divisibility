import React, {ReactElement, useEffect, useRef, useState} from 'react';
import './App.css';

function TableRow(props: { entries: string[] }): ReactElement {
    return <div className={'table-row'}>
        <h2 className={'divisor'}>{props.entries[0]}</h2>
        <h2>{props.entries[1]}</h2>
        <h2 className={'divisible'}>{props.entries[2]}</h2>
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

function Table(props: {number: number}): ReactElement {
    useEffect(() => {
        console.log(props.number)
    }, [props.number])

    const entries = [
        ['rule', 'divisible'],
        ['Everything', true],
        ['Even', isEvenLongVersion(props.number)],
        ['Digit sum', getDigitSum(props.number) % 3 === 0],
        ['Last two digits', getNLastDigits(props.number, 2) % 4 === 0],
        ['End in 0 or 5', false],
        ['Divisible by 2 and 3', false],
        ['5 x last + rest', false],
        ['Last 3 digits', false],
        ['Digit sum', getDigitSum(props.number) % 9 === 0],
        ['End in 0', false],
        ['Alternating sum', false],
        ['Divisible by 3 and 4', false]
    ]

    return <div id={'table'}>
        {Array(entries.length).fill(null).map((_, i) => {
            return <TableRow key={i} entries={[i === 0 ? 'divisor' : String(i), String(entries[i][0]), String(entries[i][1])]}/>
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
        <input ref={inputRef} type={'number'} defaultValue={27853}
               onChange={(e): void => props.onChange(parseInt(e.target.value))}/>
    </div>;
}

function App(): ReactElement {
    const [number, setNumber] = useState(-1)
  return (
    <div className="App">
        <img src={'bg.jpg'} alt={'bg'}/>
        <h1>Divisibility</h1>
        <h3>Memorable shortcuts for testing divisibility by 1 to 12</h3>
        <Input onChange={(n: number): void => setNumber(n)}/>
        <Table number={number}/>
    </div>
  );
}

export default App;
