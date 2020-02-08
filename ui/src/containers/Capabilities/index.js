import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { ajax } from "rxjs/ajax";
import { combineLatest } from "rxjs";
import { catchError, filter, flatMap, tap } from "rxjs/operators";

import Highlight from "react-highlight";
import "highlight.js/styles/sunburst.css";

import Select from "react-select";

import { StyledCapabilities } from "./style.css";
import BeatLoader from "react-spinners/BeatLoader";
import { useEventCallback } from "rxjs-hooks";

const code = (browser = "UNKNOWN", version = "", origin = "http://selenoid-uri:4444") => {
    return {
        yaml: `# selenium: "${origin}"
# please note that real accessible selenoid uri can be different        
browserName: "${browser}"
version: "${version}"
enableVNC: true
enableVideo: false 
`,
        curl: `curl -X POST '${origin}/wd/hub/session' -d '{ 
            "desiredCapabilities":{
                "browserName":"${browser}", 
                "version": "${version}", 
                "platform":"ANY",
                "enableVNC": true,
                "name": "this.test.is.launched.by.curl",
                "sessionTimeout": "120s"
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
        PHP: `$web_driver = RemoteWebDriver::create("${origin}/wd/hub",
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
`,
    };
};

export const sessionIdFrom = ({ response }) => {
    return response.sessionId || (response.value && response.value.sessionId) || "";
};

const Capabilities = ({ browsers = {}, origin, history }) => {
    const [browser, onBrowserChange] = useState({});
    const [lang, onLanguageChange] = useState("yaml");

    const available = [].concat(
        ...Object.keys(browsers).map(name =>
            Object.keys(browsers[name]).map(version => {
                return {
                    value: `${name}_${version}`,
                    label: `${name}: ${version}`,
                    name,
                    version,
                };
            })
        )
    );

    const { name, version, value } = browser || {};
    const caps = code(name, version, origin);

    return (
        <StyledCapabilities>
            <div className="section-title">Capabilities</div>
            <div className="setup">
                <Select
                    className="capabilities-browser-select"
                    name="browsers"
                    value={available.find(item => item.value === value)}
                    options={available}
                    onChange={browser => onBrowserChange(browser)}
                    placeholder="Select browser..."
                    isLoading={!origin}
                    clearable={false}
                    noResultsText="No information about browsers"
                />
                <Launch browser={browser} history={history} />
            </div>
            <Highlight className={lang}>{caps[lang]}</Highlight>

            <div className="lang-selector">
                <div className="capabilities-langs">
                    {Object.keys(caps).map(next => (
                        <div
                            key={next}
                            className={`capabilities-lang ${next === lang && "capabilities-lang_active"}`}
                            onClick={() => onLanguageChange(next)}
                        >
                            {next}
                        </div>
                    ))}
                </div>
            </div>
        </StyledCapabilities>
    );
};

const Launch = ({ browser: { name, version }, history }) => {
    const defaultAdditionalCaps = { operaOptions: { binary: "/usr/bin/opera" } };

    const [loading, onLoading] = useState(false);
    const [error, onError] = useState("");
    const [useMoreCaps, toggleMoreCaps] = useState(false);
    const [moreCapsError, onMoreCapsError] = useState(false);
    const [moreCaps, setMoreCaps] = useState(JSON.stringify(defaultAdditionalCaps));

    const [createSession] = useEventCallback(
        (event$, inputs$) =>
            combineLatest(event$, inputs$).pipe(
                tap(() => {
                    onError("");
                    onLoading(true);
                }),
                flatMap(([_, [name, version, history, useMoreCaps, moreCapsError, moreCaps]]) => {
                    let desiredCapabilities = {
                        browserName: `${name}`,
                        version: `${version}`,
                        enableVNC: true,
                        labels: { manual: "true" },
                        sessionTimeout: "60m",
                        name: "Manual session",
                    };
                    let selenoidOptions = {
                        enableVNC: true,
                        sessionTimeout: "60m",
                        labels: { manual: "true" },
                    };

                    if (useMoreCaps && !moreCapsError) {
                        const additionalCaps = JSON.parse(moreCaps);
                        desiredCapabilities = Object.assign(desiredCapabilities, additionalCaps);
                        selenoidOptions = Object.assign(selenoidOptions, additionalCaps);
                    }

                    return ajax({
                        url: "/wd/hub/session",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: {
                            desiredCapabilities,
                            capabilities: {
                                alwaysMatch: {
                                    browserName: `${name}`,
                                    browserVersion: `${version}`,
                                    "selenoid:options": selenoidOptions,
                                },
                            },
                        },
                    }).pipe(
                        filter(({ status }) => status === 200),
                        tap(res => history.push(`/sessions/${sessionIdFrom(res)}`))
                    );
                }),
                catchError((err, caught) => {
                    console.error("Can't start session manually", err);
                    onError(err);
                    onLoading(false);
                    return caught;
                })
            ),
        [name, version, history],
        [name, version, history, useMoreCaps, moreCapsError, moreCaps]
    );

    const onTextareaUpdate = e => {
        setMoreCaps(e.target.value);
        try {
            JSON.parse(e.target.value);
            onMoreCapsError(false);
        } catch (e) {
            onMoreCapsError(e);
        }
    };

    return (
        <div>
            <button
                onClick={createSession}
                disabled={!name || loading}
                className={`new-session disabled-${!name || loading} error-${!!error}`}
                onMouseLeave={() => onError("")}
                title={error}
            >
                {loading ? <BeatLoader size={3} color={"#fff"} /> : `Create Session`}
            </button>
            {!name || loading ? null : (
                <button onClick={() => toggleMoreCaps(!useMoreCaps)} className={"new-session-more-capabilities"}>
                    More capabilities
                </button>
            )}
            {!useMoreCaps ? null : (
                <textarea
                    spellCheck={false}
                    rows={7}
                    onChange={onTextareaUpdate}
                    className={`more-capabilities error-${!!moreCapsError}`}
                    defaultValue={JSON.stringify(defaultAdditionalCaps, null, 2)}
                />
            )}
        </div>
    );
};

Capabilities.propTypes = {
    browsers: PropTypes.object,
    origin: PropTypes.string,
};

export default withRouter(Capabilities);
