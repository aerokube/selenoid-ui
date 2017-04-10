import React, {Component} from "react";
import "./style.scss";
import Browser from "./Browser";


export default class Browsers extends Component {
    render() {
        const {totalUsed, browsers} = this.props;
        const browsersUsed = {};

        Object.keys(browsers)
            .forEach(browser => {
                browsersUsed[browser] = 0;
                Object.keys(browsers[browser]).forEach(version => {
                    Object.keys(browsers[browser][version])
                        .forEach(quotaName => {
                            browsersUsed[browser] += browsers[browser][version][quotaName];
                        })
                })
            });

        const values = Object.keys(browsersUsed)
            .sort((a, b) => browsersUsed[b] - browsersUsed[a])
            .map(browser => {
                return (
                    <Browser key={browser} name={browser} used={browsersUsed[browser]} totalUsed={totalUsed}/>
                );
            });

        return (
            <div className="browsers">
                {values}
            </div>
        );
    }
}
