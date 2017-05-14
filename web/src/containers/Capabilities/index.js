import React, {Component} from "react";
import PropTypes from "prop-types";

import Highlight from "react-highlight";
import "highlight.js/styles/sunburst.css";

import Select from "react-select";
import "react-select/dist/react-select.css";

import "./select.scss";
import "./style.scss";


const code = (browser, version, origin) => {
    return {
        yaml: `# selenium: "${origin || 'http://selenoid-uri:4444/wd/hub'}"
browserName: "${browser}"
version: "${version}"
`,
        java: `DesiredCapabilities browser = new DesiredCapabilities();
browser.setBrowserName("${browser}");
browser.setVersion("${version}");
RemoteWebDriver driver = new RemoteWebDriver(
    URI.create("${origin}/wd/hub").toURL(), 
    browser
);
`,
        javascript: `var webdriverio = require('webdriverio');
var options = { 
    desiredCapabilities: { 
        browserName: '${browser}', 
        version: '${version}' 
    } 
};
var client = webdriverio.remote(options);
`
    }
};

export default class Capabilities extends Component {
    static propTypes = {
        state: PropTypes.object,
        origin: PropTypes.string
    };

    onBrowserChange = (browser) => {
        this.setState({browser})
    };

    onLanguageChange = (lang) => {
        this.setState({lang})
    };

    render() {
        const {state = {browsers: {}}, origin} = this.props;
        const {browser = {}, lang = 'yaml'} = this.state || {};
        const browsers = [].concat(...Object.keys(state.browsers)
            .map(name => Object.keys(state.browsers[name])
                .map(version => {
                    return {
                        value: `${name}_${version}`,
                        label: `${name}: ${version}`,
                        name,
                        version
                    }
                })));

        const {name, version, value} = browser || {};

        return (
            <div className="capabilities">
                <div className="capabilities__section-title">
                    Capabilities
                </div>
                <div className="capabilities__setup">
                    <Select
                        className="capabilities-browser-select"
                        name="browsers"
                        value={value}
                        options={browsers}
                        onChange={this.onBrowserChange}
                        placeholder="Select browser..."
                        isLoading={!origin}
                        clearable={false}
                        noResultsText="No information about browsers"
                    />
                </div>
                <Highlight className={lang}>
                    {code(name, version, origin)[lang]}
                </Highlight>

                <div className="capabilities__lang-selector">
                    <div className="capabilities-langs">
                        {
                            ['yaml', 'java', 'javascript']
                                .map(next =>
                                    <div key={next}
                                         className={`capabilities-lang ${next === lang && 'capabilities-lang_active'}`}
                                         onClick={() => this.onLanguageChange(next)}>
                                        {next}
                                    </div>
                                )
                        }
                    </div>
                </div>

            </div>
        );
    }
}
