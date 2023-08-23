import React, {ReactElement, useEffect, useRef} from "react";
import {DEFAULT_DIVIDEND} from "./App";
import './Input.css'

export function Input(props: { onChange: (n: number) => void }): ReactElement {
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
        <input ref={inputRef} type={'number'} defaultValue={DEFAULT_DIVIDEND} maxLength={6} max={maxValue}
               min={minValue}
               onChange={(e): void => onChange(e)}/>
    </label></>
}
