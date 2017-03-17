import React, {Component} from "react";
import "./style.scss";
import Browser from "./Browser";


export default class Browsers extends Component {
    render() {
        const browsers = {};
        Object.keys(this.props.browsers)
            .forEach(browser => {
                browsers[browser] = 0;
                Object.keys(this.props.browsers[browser]).forEach(version => {
                    Object.keys(this.props.browsers[browser][version])
                        .forEach(quotaName => {
                            browsers[browser] += this.props.browsers[browser][version][quotaName];
                        })
                })
            });

        const values = Object.keys(browsers)
            .sort((a, b) => browsers[b] - browsers[a])
            .map(browser => {
                return (
                    <Browser key={browser} name={browser} used={browsers[browser]} totalUsed={this.props.totalUsed}/>
                );
            });

        return (
            <div className="browsers">
                {values}
            </div>
        );
    }
}
