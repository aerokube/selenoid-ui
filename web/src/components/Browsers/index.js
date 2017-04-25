import React, {Component} from "react";
import {rxConnect} from "rx-connect";
import "./style.scss";
import Browser from "./Browser";

@rxConnect(props$ => {
    return props$.map(({totalUsed, browsers}) => {
        const browsersUsed = {};

        Object.keys(browsers)
            .forEach(browser => {
                browsersUsed[browser] = 0;
                Object.keys(browsers[browser]).forEach(version => {
                    Object.keys(browsers[browser][version])
                        .forEach(quotaName => {
                            browsersUsed[browser] += browsers[browser][version][quotaName].count;
                        })
                })
            });

        return {
            browsers: Object.keys(browsersUsed)
                .sort((a, b) => browsersUsed[b] - browsersUsed[a])
                .map(browser => ({
                    totalUsed: totalUsed,
                    name: browser,
                    used: browsersUsed[browser]
                }))
        };
    });
})
export default class Browsers extends Component {
    render() {
        const {browsers} = this.props;

        return (
            <div className="browsers">
                {browsers.map(browser =>
                    (
                        <Browser key={name} {...browser}/>
                    )
                )}
            </div>
        );
    }
}
