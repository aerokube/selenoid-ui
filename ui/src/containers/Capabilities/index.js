import React, {Component} from "react";
import PropTypes from "prop-types";
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/dom/ajax';

import Highlight from "react-highlight";
import "highlight.js/styles/sunburst.css";

import Select from "react-select";
import Button from '@material-ui/core/Button';

import "./select.scss";
import "./style.scss";


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

    requestOldJson = () => {
      const {browser} = this.state
      const oldJson = JSON.stringify({
        "desiredCapabilities": {
          "browserName": `${browser.name}`,
          "version": `${browser.version}`,
        }
      })
      const session = Observable.ajax({
        url: '/webdriver/',
        method: 'POST',
        body: oldJson,
      })

      session.subscribe(
        res => console.error(res),
        err => console.error(err),
      );
    }

    createSession = () => {
        if (this.state && this.state.browser) {
            const {browser} = this.state

            const newJson = JSON.stringify({
              "capabilities": {
                "alwaysMatch": {
                  "browserName": `${browser.name}`,
                  "browserVersion": `${browser.version}`,
                },
                "firstMatch": []
              }
            })

            const session = Observable.ajax({
              url: '/webdriver/',
              method: 'POST',
              body: newJson,
            })

            session.subscribe(
                res => {
                  if (res.status !== 200) {
                    this.requestOldJson()
                  }
                },
                err => {
                  console.error(err)
                  this.requestOldJson()
                }
            );
        }
    }

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
            <div className="capabilities">
                <div className="capabilities__section-title">
                    Capabilities
                </div>
                <div className="capabilities__setup">
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
                    <Button variant="outlined" color="primary" onClick={this.createSession}>
                      Create Session
                    </Button>
                </div>
                <Highlight className={lang}>
                    {caps[lang]}
                </Highlight>

                <div className="capabilities__lang-selector">
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

            </div>
        );
    }
}
