import React, {Component} from "react";
import {serverSentEventConnect} from "react-server-sent-event-container";
import "./style.scss";
import Quota from "components/Quota";
import Browsers from "components/Browsers";
import Status from "components/Status";
import {validate} from "jsonschema";

const defaults = {
    status: 'unknown',
    selenoid: {
        "total": 0,
        "used": 0,
        "queued": 0,
        "pending": 0,
        "browsers": {}
    }
};


const schema = {
    "id": "/selenoid",
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
        if (props.selenoid) {
            const validation = validate(props.selenoid, schema);

            if (validation.valid) {
                this.setState(props);
            } else {
                this.setState({status: "error"});
                console.error("Wrong data from backend", validation.errors);
            }
        } else {
            this.setState({status: props.status});
        }
    }

    render() {
        return (
            <div className="viewport">
                <Status status={this.state.status}/>
                <Quota total={this.state.selenoid.total} used={this.state.selenoid.used}/>
                <Browsers browsers={this.state.selenoid.browsers} totalUsed={this.state.selenoid.used}/>
            </div>
        );
    }
}
const onOpen = (props, source) => {
    props.update({status: 'ok'});
};

const onMessage = (event, props, source) => {
    const item = JSON.parse(event.data);

    if (item.errors) {
        props.update({
            errors: item.errors,
            status: 'error',
        });
    } else {
        props.update({
            status: 'ok',
            selenoid: item,
        });
    }
};

const onError = (event, props, source) => {
    console.error('SSE Error', event);
    props.update({status: 'error'});
    source.close();
};

export default serverSentEventConnect('/events', false, onOpen, onMessage, onError)(App);
