import React, {Component} from "react";
import {Link} from "react-router-dom";

import VncScreen from "./VncScreen"
import VncInfo from "./VncInfo"
import "./style.scss";


export default class Vnc extends Component {
    state = {connection: 'connecting'};

    connection(connection) {
        this.setState({connection: connection});
    }

    icon(connection) {
        switch (connection) {
            case 'disconnected': {
                return 'dripicons-document-delete';
            }
            case 'disconnecting':
            case 'connecting': {
                return 'dripicons-dots-3';
            }
        }
    }

    handleFullscreen = () => {
        this.setState({ fullscreen: !this.state.fullscreen});
    };

    render() {
        const {origin, session, browser} = this.props;
        const {connection, fullscreen} = this.state;

        return (
            <div className="vnc">
                <div className={`vnc-card ${fullscreen && "vnc-card_fullscreen"}`}>
                    <div className="vnc-card__controls">
                        <Link className="control" to="/vnc/">
                            <span title="Back" className="icon dripicons-arrow-thin-left"/>
                        </Link>

                        <div className={`control control_${connection}`}>
                            <span title={connection} className={`icon ${this.icon(connection)}`}/>
                        </div>

                        <div className="control control_fullscreen" onClick={this.handleFullscreen}>
                            <span title="Fullscreen" className={'icon dripicons-' + (fullscreen ? 'contract' : 'expand')}/>
                        </div>
                    </div>

                    <div className="vnc-card__content">
                        <VncInfo session={session} browser={browser}/>
                        <VncScreen session={session} origin={origin} onUpdateState={(state) => this.connection(state)}/>
                    </div>
                </div>
            </div>
        );
    }
}
