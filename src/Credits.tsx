import React, {ReactElement} from "react";
import './Credits.scss'

function CreditsLink(props: { url: string, title: string }): ReactElement {
    return <div className={"link-container"}>
        <img className={"stroke"} src={"stroke-green.svg"} alt={"stroke"}></img>
        <a href={props.url}>{props.title}</a>
        <img className={"stroke-underline"} src={"stroke-black.svg"} alt={"underline"}></img>
    </div>;
}

export function Credits(): ReactElement {
    return <div id={'credits'}>
        <h4 id={'numberphile-link'}>{'Inspired by Numberphile video'}
            <CreditsLink url={"https://www.youtube.com/watch?v=UDQjn_-pDSs"} title={'Why 7 is Weird'}/>
        </h4>
        <h4 id={'wiki-link'}>{'More divisibility rules on'}
            <CreditsLink url={'https://en.wikipedia.org/wiki/Divisibility_rule'} title={'Wikipedia'}/>
        </h4>
        <h4 id={'github-link'}>{'Source code on'}
            <CreditsLink url={'https://github.com/antonjolsson/divisibility'} title={'GitHub'}/>
        </h4>
    </div>;
}
