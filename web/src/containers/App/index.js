import React, {Component} from "react";
import "./style.scss";
import Quota from "components/Quota";
import Browsers from "components/Browsers";

const stats = JSON.parse(`
    {
        "total": 400,
        "used": 361,
        "queued": 0,
        "pending": 1,
        "browsers": {
            "chrome": {
                "53.0": {
                    "testpers": 130
                }
            },
            "verylongBrowserTitleWithHugeNumberOfUsages": {
                "53.0": {
                    "testpers": 10
                }
            },
            "firefox": {
                "46.0": {},
                "48.0": {
                    "rel": 1,
                    "testpers": 110
                }
            },
            "android": {
                "46.0": {},
                "48.0": {
                }
            },
            "ios": {
                "46.0": {},
                "48.0": {
                "testpers": 30
                }
            },
            "internetExplorer": {
                "46.0": {},
                "48.0": {
                "testpers": 80
                }
            }
        }
    }
`);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = stats
    }

    componentWillReceiveProps(props) {
        this.setState(props);
    }


    render() {
        return (
            <div className="viewport">
                <Quota total={this.state.total} used={this.state.used}/>
                <Browsers browsers={this.state.browsers} totalUsed={this.state.used} />
            </div>
        );
    }
}

const onMessage = (event, props, source) => {
    const item = JSON.parse(event.data);
    props.update({'brows': item.brows});
};

const onError = (event, props, source) => {
    console.error('SSE Error', event);
    source.close();
};

// export default serverSentEventConnect('/sse', false, false, onMessage, onError)(App);
export default App;
