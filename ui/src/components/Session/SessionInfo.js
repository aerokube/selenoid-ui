import React from "react";
import PropTypes from 'prop-types';

import BeatLoader from "react-spinners/BeatLoader";

const SessionInfo = ({session = "", browser = { caps: {}}}) => {
    return (
        <div className="session-info">

            <div className="session-info__main">
                <div className="session-browser">
                    <BeatLoader
                        size={5}
                        color={'#fff'}
                        loading={!browser.quota}
                    />
                    <span className="session-browser__quota">{browser.quota}</span>
                    {browser.quota && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__name">{browser.caps.browserName}</span>
                    {browser.caps.browserName && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__version">{browser.caps.version}</span>
                    {browser.caps.version && (<span className="session-browser__version-separator">/</span>)}
                    <span className="session-browser__resolution">{browser.caps.screenResolution}</span>
                </div>


                <div className="session-info__id">{session.substring(0, 8)}</div>
            </div>

            <div className="session-info__additional">
                <div className="custom-capabilities">
                    {browser.caps.name && (<div className="custom-capabilities__name">{browser.caps.name}</div>)}
                </div>
            </div>
        </div>
    );
};

SessionInfo.propTypes = {
    session: PropTypes.string,
    browser: PropTypes.shape({
        quota: PropTypes.string,
        caps: PropTypes.shape({
            browserName: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            screenResolution: PropTypes.string,
            name: PropTypes.string,
        }).isRequired,
    }),
};

export default SessionInfo;
