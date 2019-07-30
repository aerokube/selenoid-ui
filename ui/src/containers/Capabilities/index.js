import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { ajax } from 'rxjs/ajax';
import { combineLatest } from 'rxjs';
import { catchError, filter, flatMap, tap } from 'rxjs/operators';

import Highlight from "react-highlight";
import "highlight.js/styles/sunburst.css";

import Select from "react-select";

import { StyledCapabilities } from "./style.css";
import { BeatLoader } from "react-spinners";
import { useEventCallback } from "rxjs-hooks";


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

export const sessionIdFrom = ({ response }) => {
    return response.sessionId || (response.value && response.value.sessionId) || '';
};

const Capabilities = ({ state = { browsers: {} }, origin, history }) => {
    const [browser, onBrowserChange] = useState({});
    const [lang, onLanguageChange] = useState('yaml');

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

    const { name, version, value } = browser || {};
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
                    value={browsers.find(item => item.value === value)}
                    options={browsers}
                    onChange={(browser) => onBrowserChange(browser)}
                    placeholder="Select browser..."
                    isLoading={!origin}
                    clearable={false}
                    noResultsText="No information about browsers"
                />
                <Launch browser={browser} history={history}/>
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
                                     onClick={() => onLanguageChange(next)}>
                                    {next}
                                </div>
                            )
                    }
                </div>
            </div>

        </StyledCapabilities>
    );
};

const Launch = ({ browser: { name, version }, history }) => {
    const [loading, onLoading] = useState(false);
    const [error, onError] = useState('');

    const [createSession] = useEventCallback((event$, inputs$) => combineLatest(event$, inputs$).pipe(
        tap(() => {
            onError('');
            onLoading(true);
        }),
        flatMap(([_, [name, version, history]]) => {
            return ajax({
                url: '/wd/hub/session',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    "desiredCapabilities": {
                        "browserName": `${name}`,
                        "version": `${version}`,
                        "enableVNC": true,
                        "sessionTimeout": "60m",
                        "name": "Manual session"
                    },
                    "capabilities": {
                        "alwaysMatch": {
                            "browserName": `${name}`,
                            "browserVersion": `${version}`,
                            "selenoid:options": {
                                "enableVNC": true,
                                "sessionTimeout": "60m"
                            }
                        }
                    }
                },
            }).pipe(
                filter(({ status }) => status === 200),
                tap(res => history.push(`/sessions/${sessionIdFrom(res)}`)),
            );
        }),
        catchError((err, caught) => {
            console.error("Can't start session manually", err);
            onError(err);
            onLoading(false);
            return caught;
        })
    ), [name, version, history], [name, version, history]);

    return (
        <button
            onClick={createSession}
            disabled={!name || loading}
            className={`new-session disabled-${!name || loading} error-${!!error}`}
            onMouseLeave={() => onError('')}
            title={error}
        >
            {loading ? <BeatLoader size={3} color={'#fff'}/> : `Create Session`}
        </button>
    );
};

Capabilities.propTypes = {
    state: PropTypes.object,
    origin: PropTypes.string
};

export default withRouter(Capabilities)
