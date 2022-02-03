import React, { Component } from "react";
import { Link } from "react-router-dom";

import VncScreen from "./VncScreen";
import { StyledVNC } from "./style.css";

export default class VncCard extends Component {
    state = { connection: "connecting" };

    connection = connection => {
        this.setState({ connection: connection });
    };

    componentDidMount() {
        this.setState({ fullscreen: true });
        this.setState({ unlocked: true });
        this.screen.lock(true);
    }
    
    handleFullscreen = () => {
        this.props.onVNCFullscreenChange(!this.state.fullscreen);
        this.setState({ fullscreen: !this.state.fullscreen });
    };

    handleLock = () => {
        this.setState({ unlocked: !this.state.unlocked });
        this.screen && this.screen.lock(!this.state.unlocked);
    };

    render() {
        const { origin, session, browser = {}, className } = this.props;
        const { connection, fullscreen, unlocked } = this.state;
        const connected = connection === "connected";

        if (browser.caps && !browser.caps.enableVNC) {
            return <span />;
        }

        return (
            <StyledVNC className={`${className} ${fullscreen && "fullscreen"}`}>
                <div className={`vnc-card ${!connected && "vnc-card_small"} ${fullscreen && "vnc-card_fullscreen"}`}>
                    <div className="vnc-card__controls">
                        <Back />
                        <Connection connection={connection} />
                        {connected && <Lock locked={!unlocked} handleLock={this.handleLock} />}
                        {connected && <Fullscreen handleFullscreen={this.handleFullscreen} fullscreen={fullscreen} />}
                    </div>

                    <div className="vnc-card__content">
                        <VncScreen
                            ref={instance => {
                                this.screen = instance;
                            }}
                            session={session}
                            origin={origin}
                            onUpdateState={state => this.connection(state)}
                        />
                    </div>
                </div>

                {!connected && (
                    <div className={`vnc-connection-status vnc-connection-status_${connection}`}>VNC {connection}</div>
                )}
            </StyledVNC>
        );
    }
}

function Back() {
    return (
        <Link className="control control_back" to="/">
            <div title="Back">X</div>
        </Link>
    );
}

function Connection(props) {
    const { connection } = props;
    const icon = function(connection) {
        switch (connection) {
            default:
            case "disconnected": {
                return "dripicons-document-delete";
            }
            case "disconnecting":
            case "connecting": {
                return "dripicons-dots-3";
            }
        }
    };

    return (
        <div className={`control control_${connection}`}>
            <span title={connection} className={`icon ${icon(connection)}`} />
        </div>
    );
}

function Fullscreen(props) {
    const { handleFullscreen, fullscreen } = props;
    return (
        <div className="control control_fullscreen" onClick={handleFullscreen}>
            <div title="Fullscreen" className={"icon dripicons-" + (fullscreen ? "chevron-down" : "chevron-up")} />
        </div>
    );
}

function Lock(props) {
    const { locked, handleLock } = props;
    return (
        <div className="control control_lock" onClick={handleLock}>
            <div title="Lock/Unlock Screen" className={"icon dripicons-" + (locked ? "lock" : "lock-open")} />
        </div>
    );
}
