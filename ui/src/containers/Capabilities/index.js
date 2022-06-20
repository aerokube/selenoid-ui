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

import Url from "url-parse";

const code = (browser = "UNKNOWN", version = "", origin = "http://selenoid-uri:4444") => {
    const url = new Url(origin);
    origin = window.location.protocol + "//" + window.location.hostname + (window.location.port == "" ? "" : ":4444");
    let optionsClass = "SpecificBrowserOptions";
    switch (browser) {
        case "UNKNOWN":
        case "chrome":
            optionsClass = "ChromeOptions";
            break;
        case "firefox":
            optionsClass = "FirefoxOptions";
            break;
        case "safari":
            optionsClass = "SafariOptions";
            break;
        case "MicrosoftEdge":
            optionsClass = "EdgeOptions";
            break;
    }
    return {
        curl: `curl -H'Content-Type: application/json' ${origin}/wd/hub/session -d'{
    "capabilities": {
        "alwaysMatch": {
            "browserName": "${browser != "UNKNOWN" ? browser : "chrome"}",
            ${version == "" ? "" : "\"browserVersion\": \"" + version + "\","}
            "selenoid:options": {
                "name": "Session started using curl command...",
                "sessionTimeout": "1m"
            }
        }
    }
}'
`,
        java: `${optionsClass} options = new ${optionsClass}();
${version != "" ? "options.setCapability(\"browserVersion\", \"" + version + "\");" : ""}
options.setCapability("selenoid:options", new HashMap<String, Object>() {{
    /* How to add test badge */
    put("name", "Test badge...");

    /* How to set session timeout */
    put("sessionTimeout", "15m");

    /* How to set timezone */
    put("env", new ArrayList<String>() {{
        add("TZ=UTC");
    }});

    /* How to add "trash" button */
    put("labels", new HashMap<String, Object>() {{
        put("manual", "true");
    }});

    /* How to enable video recording */
    put("enableVideo", true);
}});
RemoteWebDriver driver = new RemoteWebDriver(new URL("${origin}/wd/hub"), options);
`,
        go: `// import "github.com/tebeka/selenium"

caps := selenium.Capabilities{
        "browserName":    "${browser != "UNKNOWN" ? browser : "chrome"}",
		"browserVersion": "${version}",
		"selenoid:options": map[string]interface{}{
                /* How to add test badge */
                "name": "Test badge...",

                /* How to set session timeout */
                "sessionTimeout": "5m",

                /* How to set timezone */
                "env": []string{
                        "TZ=UTC",
                },

                /* How to add "trash" button */
                "labels": map[string]interface{}{
                        "manual": "true",
                },

                /* How to enable video recording */
                "enableVideo": true,
        },
}

driver, err := selenium.NewRemote(caps, "http://moon.aerokube.local/wd/hub")
if err != nil {
        t.Errorf("starting browser: %v", err)
}
defer driver.Quit()
`,
        "C#": `${optionsClass} options = new ${optionsClass}();
${version != "" ? "options.BrowserVersion = \"" + version + "\";" : ""}
options.AddAdditionalOption("selenoid:options", new Dictionary<string, object> {
    /* How to add test badge */
    ["name"] = "Test badge...",

    /* How to set session timeout */
    ["sessionTimeout"] = "15m",

    /* How to set timezone */
    ["env"] = new List<string>() {
        "TZ=UTC"
    },

    /* How to add "trash" button */
    ["labels"] = new Dictionary<string, object> {
        ["manual"] = "true"
    },

    /* How to enable video recording */
    ["enableVideo"] = true
});
IWebDriver driver = new RemoteWebDriver(new Uri("http://moon.aerokube.local/wd/hub"), options);
`,
        python: `from selenium import webdriver
        
capabilities = {
    "browserName": "${browser != "UNKNOWN" ? browser : "chrome"}",
    "browserVersion": "${version}",
    "selenoid:options": {
        "enableVideo": False
    }
}

driver = webdriver.Remote(
    command_executor="${origin}/wd/hub",
    desired_capabilities=capabilities)
`,
        javascript: `var webdriverio = require('webdriverio');
        
var options = { 
    hostname: '${window.location.hostname}',
    port: 4444,
    protocol: '${window.location.protocol == "https:" ? "https" : "http"}',
    capabilities: { 
        browserName: '${browser != "UNKNOWN" ? browser : "chrome"}',
        browserVersion: '${version}',
        'selenoid:options': {
            enableVideo: false 
        }      
    } 
};
var client = webdriverio.remote(options);
`,
        PHP: `$web_driver = RemoteWebDriver::create("${origin}/wd/hub",
array("browserName"=>"${browser != "UNKNOWN" ? browser : "chrome"}", "browserVersion"=>"${version}")
);
`,
        ruby: `caps = Selenium::WebDriver::Remote::Capabilities.new
browserName: '${browser != "UNKNOWN" ? browser : "chrome"}',
caps["browserVersion"] = "${version}"

driver = Selenium::WebDriver.for(:remote,
  :url => "${origin}/wd/hub",
  :desired_capabilities => caps)
`,
    };
};

export const sessionIdFrom = ({ response }) => {
    return response.sessionId || (response.value && response.value.sessionId) || "";
};

const Capabilities = ({ browsers = {}, origin, history }) => {
    const [browser, onBrowserChange] = useState({});
    const [lang, onLanguageChange] = useState("curl");

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
                        timeout: 300000,
                        body: {
                            desiredCapabilities,
                            capabilities: {
                                alwaysMatch: {
                                    browserName: `${name}`,
                                    browserVersion: `${version}`,
                                    "selenoid:options": selenoidOptions,
                                },
                                firstMatch: [{}],
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
