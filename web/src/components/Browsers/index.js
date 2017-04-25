import React, {Component} from "react";
import {rxConnect} from "rx-connect";
import "./style.scss";
import Browser from "./Browser";

@rxConnect(props$ => {
    return props$.map(({totalUsed, browsers}) => {
        return {
            totalUsed: totalUsed,
            browsers: Object.keys(browsers)
                .sort((a, b) => browsers[b] - browsers[a])
                .map(browser => ({
                    name: browser,
                    used: browsers[browser]
                }))
        };
    });
})
export default class Browsers extends Component {
    render() {
        const {browsers, totalUsed} = this.props;

        return (
            <div className="browsers">
                {browsers.map(browser =>
                    (
                        <Browser key={name} totalUsed={totalUsed} {...browser}/>
                    )
                )}
            </div>
        );
    }
}
