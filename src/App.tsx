import React, {ReactElement, useEffect, useRef, useState} from 'react';
import './App.css';

function TableRow(props: { entries: string[], marked: boolean }): ReactElement {
    return <div className={'table-row'}>
        <img className={`stroke ${props.marked ? '' : 'reverse-anim'}`} src={'stroke.svg'} alt={'stroke'}></img>
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

function Table(props: {number: number}): ReactElement {
    useEffect(() => {
    }, [props.number])

    const entries = [
        ['rule', 'divisible'],
        ['Everything', true],
        ['Even', isEvenLongVersion(props.number)],
        ['Digit sum', getDigitSum(props.number) % 3 === 0],
        ['Last two digits', divisibleBy4(props.number)],
        ['End in 0 or 5', [0, 5].includes(getNLastDigits(props.number, 1))],
        ['Divisible by 2 and 3', isEvenLongVersion(props.number) && getDigitSum(props.number) % 3 === 0],
        ['5 x last + rest', divisibleBy7(props.number)],
        ['Last 3 digits', isEvenLongVersion(getNLastDigits(props.number, 3) / 2 / 2)],
        ['Digit sum', getDigitSum(props.number) % 9 === 0],
        ['End in 0', getNLastDigits(props.number, 1) === 0],
        ['Alternating sum', divisibleBy11(props.number)],
        ['Divisible by 3 and 4', getDigitSum(props.number) % 3 === 0 && divisibleBy4(props.number)]
    ]

    return <div id={'table'}>
        {Array(entries.length).fill(null).map((_, i) => {
            return <TableRow key={i} marked={i > 0 && Boolean(entries[i][1])}
                             entries={[i === 0 ? 'divisor' : String(i), String(entries[i][0]), String(entries[i][1])]}/>
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
    const [number, setNumber] = useState(-1)
  return (
    <div className="App">
        <img id={'bg'} src={'bg.jpg'} alt={'bg'}/>
        <h1>Divisibility</h1>
        <h3>Memorable shortcuts for testing divisibility by 1 to 12</h3>
        <Input onChange={(n: number): void => setNumber(n)}/>
        <Table number={number}/>
    </div>
  );
}

export default App;
