import React from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import "./style.scss";


const Videos = (props) => {
    const {videos} = props;
    const list = Object.keys(videos);

    return (

        <div className="videos">
            <div className="videos__section-title">
                Videos
            </div>
            <TransitionGroup className={`videos__list videos__list_count-${list.length}`}>
                {list.length && list.map(video => {
                        let src = "/video/"+videos[video];
                        return (

                            <CSSTransition
                                key={video}
                                timeout={500}
                                classNames="videos-container_state"
                                unmountOnExit
                            >

                                <div className="videos-container">
                                    <div className="video-cap video-cap__name"
                                         title={videos[video]}>
                                        {videos[video]}
                                    </div>
                                    <video controls>
                                        <source src={src} type="video/mp4" />
                                    </video>
                                </div>
                            </CSSTransition>
                        );
                    }
                )}
            </TransitionGroup>
            {(
                <CSSTransition
                    in={!list.length}
                    timeout={500}
                    exit={false}
                    classNames="videos__no-any_state"
                    unmountOnExit
                >
                    <div className="videos__no-any">
                        <div title="No any" className="icon dripicons-hourglass"/>
                        <div className="nosession-any-text">NO VIDEOS YET :'(</div>
                    </div>
                </CSSTransition>
            )}

        </div>
    );

};

export default Videos;
