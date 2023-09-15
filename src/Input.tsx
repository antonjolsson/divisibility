import React, {ReactElement, useEffect, useRef} from "react";
import {DEFAULT_DIVIDEND} from "./App";
import './Input.scss'

export function Input(props: { onChange: (n: number) => void }): ReactElement {
    const maxValue = 999999
    const minValue = 0
    const inputRef = useRef<HTMLInputElement>(null)
    const currentNumberRef = useRef(-1)

    useEffect(() => {
        if (inputRef.current) {
            currentNumberRef.current = parseInt(inputRef.current.value)
            props.onChange(currentNumberRef.current)
        }
    }, [])

    function onChange(e: React.ChangeEvent<HTMLInputElement>): void {
        let value = parseInt(e.target.value)
        if (value > maxValue) {
            value = currentNumberRef.current
        } else if (value < minValue) {
            value = minValue
        }
        currentNumberRef.current = value
        e.target.value = String(value)
        props.onChange(value);
    }

    return <><label>Number to test
        <input ref={inputRef} type={'number'} defaultValue={DEFAULT_DIVIDEND} maxLength={6} max={maxValue}
               min={minValue}
               onChange={(e): void => onChange(e)}/>
    </label></>
}
