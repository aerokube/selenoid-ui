import React, {Component} from "react";
import {rxConnect} from "rx-connect";
import {StyledBrowsers} from "./style.css";
import Browser from "./Browser";

class Browsers extends Component {
    render() {
        const {browsers, totalUsed} = this.props;

        return (
            <StyledBrowsers>
                {browsers.map(browser =>
                    (
                        <Browser key={browser.name} totalUsed={totalUsed} {...browser}/>
                    )
                )}
            </StyledBrowsers>
        );
    }
}

export default rxConnect(props$ => {
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
})(Browsers)
