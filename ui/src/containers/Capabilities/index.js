import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/ajax';

import Highlight from "react-highlight";
import "highlight.js/styles/sunburst.css";

import Select from "react-select";

import {StyledCapabilities} from "./style.css";


const code = (browser = 'UNKNOWN', version = '', origin = 'http://selenoid-uri:4444') => {
    return {
        yaml: `# selenium: "${origin}"
# please note that real accessible selenoid uri can be different        
browserName: "${browser}"
version: "${version}"
enableVNC: true
enableVideo: false 
`,
        curl: `curl -X POST 'http://127.0.0.1:4444/wd/hub/session' -d '{ 
            "desiredCapabilities":{
                "browserName":"${browser}", 
                "version": "${version}", 
                "platform":"ANY",
                "enableVNC": true,
                "name": "this.test.is.launched.by.curl",
                "sessionTimeout": "30s"
            }
        }'
`,
        java: `DesiredCapabilities capabilities = new DesiredCapabilities();
capabilities.setBrowserName("${browser}");
capabilities.setVersion("${version}");
capabilities.setCapability("enableVNC", true);
capabilities.setCapability("enableVideo", false);

RemoteWebDriver driver = new RemoteWebDriver(
    URI.create("${origin}/wd/hub").toURL(), 
    capabilities
);
`,
	"C#": `var capabilities = new DesiredCapabilities("${browser}", "${version}", new Platform(PlatformType.Any));
var driver = new RemoteWebDriver(new Uri("${origin}/wd/hub"), capabilities);
`,
        python: `from selenium import webdriver
        
capabilities = {
    "browserName": "${browser}",
    "version": "${version}",
    "enableVNC": True,
    "enableVideo": False
}

driver = webdriver.Remote(
    command_executor="${origin}/wd/hub",
    desired_capabilities=capabilities)
`,
        javascript: `var webdriverio = require('webdriverio');
        
var options = { 
    host: '${origin}',
    desiredCapabilities: { 
        browserName: '${browser}', 
        version: '${version}',
        enableVNC: true,
        enableVideo: false 
    } 
};
var client = webdriverio.remote(options);
`,
	"PHP": `$web_driver = RemoteWebDriver::create("${origin}/wd/hub",
array("version"=>"${version}", "browserName"=>"${browser}")
);
`,
	ruby: `caps = Selenium::WebDriver::Remote::Capabilities.new
caps["browserName"] = "${browser}"
caps["version"] = "${version}"

driver = Selenium::WebDriver.for(:remote,
  :url => "${origin}/wd/hub",
  :desired_capabilities => caps)
`,
	go: `// "github.com/tebeka/selenium"
caps := selenium.Capabilities{"browserName": "${browser}", "version": "${version}"}
driver, err := selenium.NewRemote(caps, "${origin}/wd/hub")
if err != nil {
	panic("create selenium session: %v\n", err)
}
defer driver.Quit()
`
    }
};

export const sessionIdFrom = ({response}) => {
    return response.sessionId || (response.value && response.value.sessionId) || '';
};

class Capabilities extends React.Component {
    onBrowserChange = (browser) => {
        this.setState({browser})
    };

    onLanguageChange = (lang) => {
        this.setState({lang})
    };

    createSession = () => {
        if (this.state && this.state.browser) {
            const {browser} = this.state;

            const newJson = {
                "desiredCapabilities":
                    {
                        "browserName": `${browser.name}`,
                        "version": `${browser.version}`,
                        "enableVNC": true,
                        "sessionTimeout": "60m"
                    },
                "capabilities":
                    {
                        "alwaysMatch":
                            {
                                "browserName": `${browser.name}`,
                                "browserVersion": `${browser.version}`,
                                "selenoid:options": { "enableVNC": true, "sessionTimeout": "60m" }
                            }
                    }
            };

            const session = Observable.ajax({
                url: '/wd/hub/session',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: newJson,
            });

            session.subscribe(
                res => {
                  if (res.status === 200) {
                    this.props.history.push(`/sessions/${sessionIdFrom(res)}`)
                  }
                },
                err => {
                  console.error(err)
                }
            );
        }
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
        const caps = code(name, version, origin);

        return (
            <StyledCapabilities>
                <div className="section-title">
                    Capabilities
                </div>
                <div className="setup">
                    <Select
                        className="capabilities-browser-select"
                        name="browsers"
                        value={browsers.find(item => item.value === value )}
                        options={browsers}
                        onChange={this.onBrowserChange}
                        placeholder="Select browser..."
                        isLoading={!origin}
                        clearable={false}
                        noResultsText="No information about browsers"
                    />

                    <button onClick={this.createSession} className={`new-session new-session_disabled-${!name}`}>
                        Create Session
                    </button>
                </div>
                <Highlight className={lang}>
                    {caps[lang]}
                </Highlight>

                <div className="lang-selector">
                    <div className="capabilities-langs">
                        {
                            Object.keys(caps)
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

            </StyledCapabilities>
        );
    }
}

Capabilities.propTypes = {
    state: PropTypes.object,
    origin: PropTypes.string
};

export default withRouter(Capabilities)
