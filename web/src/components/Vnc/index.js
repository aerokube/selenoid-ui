import React, {Component} from "react";
import {Link} from "react-router-dom";

import VncScreen from "./VncScreen";
import VncInfo from "./VncInfo";
import "./style.scss";


export default class Vnc extends Component {
    state = {connection: 'connecting'};

    connection(connection) {
        this.setState({connection: connection});
    }

    handleFullscreen = () => {
        this.setState({fullscreen: !this.state.fullscreen});
    };

    render() {
        const {origin, session, browser} = this.props;
        const {connection, fullscreen} = this.state;
        const connected = connection === 'connected';

        return (
            <div className="vnc">
                <div className={`vnc-card ${!connected && "vnc-card_small"} ${fullscreen && "vnc-card_fullscreen"}`}>
                    <div className="vnc-card__controls">
                        <Back/>
                        <Connection connection={connection}/>
                        {connected && (<Fullscreen handleFullscreen={this.handleFullscreen} fullscreen={fullscreen}/>)}
                    </div>

                    <div className="vnc-card__content">
                        {connected && (<VncInfo session={session} browser={browser}/>)}
                        <VncScreen session={session} origin={origin}
                                   onUpdateState={(state) => this.connection(state)}/>
                    </div>

                </div>

                {!connected && (<div className={`vnc-connection-status vnc-connection-status_${connection}`}>{connection}</div>)}

            </div>
        );
    }
}

function Back() {
    return <Link className="control" to="/vnc/">
        <span title="Back" className="icon dripicons-arrow-thin-left"/>
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
        <span title="Fullscreen" className={'icon dripicons-' + (fullscreen ? 'contract' : 'expand')}/>
    </div>;
}
