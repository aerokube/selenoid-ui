import React, {Component} from "react";
import {serverSentEventConnect} from "react-server-sent-event-container";
import "./style.scss";
import Quota from "components/Quota";
import Browsers from "components/Browsers";
import {validate} from 'jsonschema'

const defaults =
    {
        "total": 0,
        "used": 0,
        "queued": 0,
        "pending": 0,
        "browsers": {
        }
    };


const schema = {
    "id": "/status",
    "type": "object",
    "properties": {
        "total": {
            "type": "number"
        },
        "used": {
            "type": "number"
        },
        "queued": {
            "type": "number"
        },
        "pending": {
            "type": "number"
        },
        "browsers": {
            "id": "/browser",
            "type": "object",
            "patternProperties": {
                ".*": {
                    "id": "/version",
                    "type": "object",
                    "patternProperties": {
                        ".*": {
                            "id": "/quota",
                            "type": "object",
                            "patternProperties": {
                                ".*": {
                                    "type": "number",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "required": [
        "total",
        "used",
        "browsers"
    ]
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = defaults
    }

    componentWillReceiveProps(props) {
        const validation = validate(props, schema);

        if (validation.valid) {
            this.setState(props);
        } else {
            console.error("Wrong data from backend", validation.errors);
        }
    }

    render() {
        return (
            <div className="viewport">
                <Quota total={this.state.total} used={this.state.used}/>
                <Browsers browsers={this.state.browsers} totalUsed={this.state.used}/>
            </div>
        );
    }
}

const onMessage = (event, props, source) => {
    const item = JSON.parse(event.data);
    props.update(item);
};

const onError = (event, props, source) => {
    console.error('SSE Error', event);
    source.close();
};

export default serverSentEventConnect('/events', false, false, onMessage, onError)(App);
