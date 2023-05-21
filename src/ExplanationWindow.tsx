import React, {ReactElement} from "react";
import {IRule} from "./App";

export function ExplanationWindow(props: { coords: { x: number; y: number }, rule: IRule }): ReactElement {
    function stopPropagation(e: React.MouseEvent<HTMLDivElement>): void {
        e.stopPropagation()
    }

    return <div id={'expl-window-container'} style={{left: props.coords.x, top: props.coords.y}}>
        <div id={'expl-window-bg'}></div>
        <div onClick={(e): void => stopPropagation(e)} id={'expl-window'}>
            <h2 id={'headline'}>{props.rule.name}</h2>
            <div id={'explanation'} dangerouslySetInnerHTML={{ __html: props.rule.explanation }}/>
        </div>
    </div>;
}
