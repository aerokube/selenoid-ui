import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { StyledVideos } from "./style.css";

const Videos = ({ videos }) => {
    const list = Object.keys(videos);
    const preloadVal = list.length > 100 ? "none" : "auto";
    return (
        <StyledVideos>
            <TransitionGroup className={`videos__list videos__list_count-${list.length}`}>
                {list.length &&
                    list.map(video => {
                        const src = "/video/" + videos[video];
                        return (
                            <CSSTransition key={video} timeout={500} classNames="videos-container_state" unmountOnExit>
                                <div className="videos-container">
                                    <div className="video-cap video-cap__name" title={videos[video]}>
                                        {videos[video]}
                                    </div>
                                    <video controls preload={preloadVal}>
                                        <source src={src} type="video/mp4" />
                                    </video>
                                </div>
                            </CSSTransition>
                        );
                    })}
            </TransitionGroup>
            {
                <CSSTransition
                    in={!list.length}
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
            }
        </StyledVideos>
    );
};

export default Videos;
