import React, {ReactElement} from 'react';
import './App.css';

function TableRow(props: { entries: string[] }): ReactElement {
    return <div className={'table-row'}>
        <h2 className={'number'}>{props.entries[0]}</h2>
        <h2>{props.entries[1]}</h2>
        <h2 className={'divisible'}>{props.entries[2]}</h2>
    </div>;
}

function Table(): ReactElement {
    const entries = [
        ['rule', 'divisible'],
        ['Everything', false],
        ['Digit sum', false],
        ['Last two digits', false],
        ['End in 0 or 5', false],
        ['Divisible by 2 and 3', false],
        ['5 x last + rest', false],
        ['Last 3 digits', false],
        ['Digit sum', false],
        ['End in 0', false],
        ['Alternating sum', false],
        ['Divisible by 3 and 4', false]
    ]

    return <main>
        {Array(entries.length).fill(null).map((_, i) => {
            return <TableRow key={i} entries={[i === 0 ? 'number' : String(i), String(entries[i][0]), String(entries[i][1])]}/>
        })}
    </main>;
}

function App(): ReactElement {
  return (
    <div className="App">
        <img src={'bg.jpg'} alt={'bg'}/>
        <h1>Divisibility</h1>
        <h3>Easily memorable shortcuts for testing divisibility of 1 to 12</h3>
        <Table />
    </div>
  );
}

export default App;
