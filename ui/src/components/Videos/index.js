import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { StyledVideo, StyledVideos } from "./style.css";

const Videos = ({ videos, query = "" }) => {
    const preloadVal = videos.length > 100 ? "none" : "auto";
    return (
        <StyledVideos>
            <TransitionGroup className={`videos__list`}>
                {videos.length &&
                    videos
                        .filter(fname => fname.includes(query))
                        .map(fname => {
                            const src = `/video/${fname}`;
                            const session = fname.split(".")[0];

                            return (
                                <CSSTransition
                                    key={fname}
                                    timeout={500}
                                    classNames="videos-container_state"
                                    unmountOnExit
                                >
                                    <RecordedVideo src={src} session={session} file={fname} preload={preloadVal} />
                                </CSSTransition>
                            );
                        })}
            </TransitionGroup>

            <CSSTransition
                in={!videos.length}
                timeout={500}
                exit={false}
                classNames="videos__no-any_state"
                unmountOnExit
            >
                <div className="no-any">
                    <div title="No any" className="icon dripicons-hourglass" />
                    <div className="nosession-any-text">NO VIDEOS YET :'(</div>
                </div>
            </CSSTransition>
        </StyledVideos>
    );
};

const RecordedVideo = ({ src, session, file, preload }) => {
    return (
        <StyledVideo>
            <div className="name" title={file}>
                {session}
            </div>
            <div className="video">
                <div className="controls">
                    <div className="control">
                        <i title="Delete" className="icon dripicons-trash" />
                    </div>
                </div>
                <div className="content">
                    <video controls preload={preload}>
                        <source src={src} type="video/mp4" />
                    </video>
                </div>
            </div>
        </StyledVideo>
    );
};

export default Videos;
