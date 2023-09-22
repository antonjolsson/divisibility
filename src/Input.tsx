import React, {ReactElement, useEffect, useRef} from "react";
import {DEFAULT_DIVIDEND} from "./App";
import './Input.scss'

function InputArrows(props: { onClick: (increment?: boolean) => void }): ReactElement {
    const upArrowDown = useRef<boolean>(false)
    const downArrowDown = useRef<boolean>(false)
    const interval = useRef<NodeJS.Timer | null>()
    const timeout = useRef<NodeJS.Timer | null>()

    function onMouseDown(arrowDown: React.MutableRefObject<boolean>): void {
        if (arrowDown.current) {
            return
        }

        arrowDown.current = true

        timeout.current = setTimeout(() => {
            interval.current = setInterval(() => {
                props.onClick(upArrowDown.current)
            }, 100)
        }, 200)
        document.addEventListener('mouseup', () => {
            upArrowDown.current = false
            downArrowDown.current = false
            clearInterval(interval.current!)
            clearTimeout(timeout.current!)
        }, {once: true})
    }

    function onMouseOver(oldArrowDown: React.MutableRefObject<boolean>, newArrowDown: React.MutableRefObject<boolean>): void {
        if (oldArrowDown.current) {
            oldArrowDown.current = false
            newArrowDown.current = true
        }
    }

    return <div className={'input-arrows'}>
        <div className={'input-arrow-up'} onClick={(): void => props.onClick(true)}
             onMouseOver={(): void => onMouseOver(downArrowDown, upArrowDown)}
             onMouseDown={(): void => onMouseDown(upArrowDown)}>▾</div>
        <div className={'input-arrow-down'} onClick={(): void => props.onClick()}
             onMouseOver={(): void => onMouseOver(upArrowDown, downArrowDown)}
             onMouseDown={(): void => onMouseDown(downArrowDown)}>▾</div>
    </div>;
}

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

    function onTextfieldChange(e: React.ChangeEvent<HTMLInputElement>): void {
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

    function onArrowsChange(increment?: boolean): void {
        const newValue = currentNumberRef.current + (increment ? 1 : -1)
        currentNumberRef.current = newValue
        if (inputRef.current) {
            inputRef.current.value = String(newValue)
        }
        props.onChange(newValue)
    }

    return <>
        <label>Number to test
            <div className={'input-container'}>
                <input ref={inputRef} type={'number'} defaultValue={DEFAULT_DIVIDEND} maxLength={6} max={maxValue}
                       min={minValue} onChange={(e): void => onTextfieldChange(e)}/>
                <InputArrows onClick={(increment?: boolean): void => onArrowsChange(increment)}/>
            </div>
    </label>
    </>
}
