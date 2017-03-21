import React, {Component} from "react";
import {serverSentEventConnect} from "react-server-sent-event-container";
import "./style.scss";
import Quota from "components/Quota";
import Queue from "components/Queue";
import Browsers from "components/Browsers";
import Status from "components/Status";
import {validate} from "jsonschema";

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
        "pending",
        "queued",
        "browsers"
    ]
};


const onOpen = (props, source) => {
    props.update({sse: 'ok'});
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
    props.update({sse: 'error', status: 'unknown'});
    source.close();
};


@serverSentEventConnect(
    '/events',
    false,
    onOpen,
    onMessage,
    onError
)
export default class App extends Component {
    state = {
        sse: 'unknown',
        status: 'unknown',
        selenoid: {
            "total": 0,
            "used": 0,
            "queued": 0,
            "pending": 0,
            "browsers": {}
        }
    };

    componentWillReceiveProps(props) {
        if (props.selenoid) {
            const validation = validate(props.selenoid, schema);

            if (validation.valid) {
                this.setState(props);
            } else {
                this.setState({status: "error", sse: "ok"});
                console.error("Wrong data from backend", validation.errors);
            }
        } else {
            this.setState({status: props.status, sse: props.sse});
        }
    }

    render() {
        const {sse, status, selenoid} = this.state;

        return (
            <div className="viewport">
                <div>
                    <Status status={sse} title="sse"/>
                    <Status status={status} title="selenoid"/>
                </div>
                <div className="stats">
                    <Quota total={selenoid.total} used={selenoid.used} pending={selenoid.pending}/>
                    <Queue queued={selenoid.queued}/>
                </div>
                <Browsers browsers={selenoid.browsers} totalUsed={selenoid.used}/>
            </div>
        );
    }
}
