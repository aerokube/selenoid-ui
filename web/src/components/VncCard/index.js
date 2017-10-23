import React, {Component} from "react";
import {Link} from "react-router-dom";

import VncScreen from "./VncScreen";
import "./style.scss";


export default class VncCard extends Component {
    state = {connection: 'connecting'};

    connection = (connection) => {
        this.setState({connection: connection});
    };

    handleFullscreen = () => {
        this.setState({fullscreen: !this.state.fullscreen});
    };

    render() {
        const {origin, session, browser = {}} = this.props;
        const {connection, fullscreen} = this.state;
        const connected = connection === 'connected';

        if (browser.caps && !browser.caps.enableVNC) {
            return <span/>
        }

        return (
            <div className={`vnc ${fullscreen && "vnc_fullscreen"}`}>
                <div className={`vnc-card ${!connected && "vnc-card_small"} ${fullscreen && "vnc-card_fullscreen"}`}>
                    <div className="vnc-card__controls">
                        <Back/>
                        <Connection connection={connection}/>
                        {connected && (<Fullscreen handleFullscreen={this.handleFullscreen} fullscreen={fullscreen}/>)}
                    </div>

                    <div className="vnc-card__content">
                        <VncScreen session={session} origin={origin}
                                   onUpdateState={(state) => this.connection(state)}/>
                    </div>

                </div>

                {!connected && (<div className={`vnc-connection-status vnc-connection-status_${connection}`}>VNC {connection}</div>)}

            </div>
        );
    }
}

function Back() {
    return <Link className="control control_back" to="/">
        <div title="Back">X</div>
    </Link>;
}

function Connection(props) {
    const {connection} = props;
    const icon = function (connection) {
        switch (connection) {
            case 'disconnected': {
                return 'dripicons-document-delete';
            }
            case 'disconnecting':
            case 'connecting': {
                return 'dripicons-dots-3';
            }
        }
    };

    return <div className={`control control_${connection}`}>
        <span title={connection} className={`icon ${icon(connection)}`}/>
    </div>;
}

function Fullscreen(props) {
    const {handleFullscreen, fullscreen} = props;
    return <div className="control control_fullscreen" onClick={handleFullscreen}>
        <div title="Fullscreen" className={'icon dripicons-' + (fullscreen ? 'chevron-down' : 'chevron-up')}/>
    </div>;
}
