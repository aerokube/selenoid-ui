import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { StyledVideo, StyledVideos } from "./style.css";
import { useDeleteVideo } from "./service";
import BeatLoader from "react-spinners/BeatLoader";
import Log from "../Log";
const Videos = ({ videos = [], query = "" }) => {
    const preloadVal = videos.length > 100 ? "none" : "auto";
    const filtered = videos.filter((fname) => fname.includes(query));

    return (
        <StyledVideos>
            <TransitionGroup className={`videos__list`}>
                {filtered.length &&
                    filtered.map((fname) => {
                        const src = `/video/${fname}`;
                        const session = fname.match(/.*(?=\.)/)[0];

                        return (
                            <div>
                                <CSSTransition
                                    key={fname}
                                    timeout={500}
                                    classNames="video__container_state"
                                    unmountOnExit
                                >
                                    <RecordedVideo src={src} session={session} file={fname} preload={preloadVal} />
                                </CSSTransition>
                                <div className="session-interactive-card">
                                    <Log session={session} browser="" hidden={false} />
                                </div>
                            </div>
                        );
                    })}
            </TransitionGroup>

            <CSSTransition
                in={!filtered.length}
                timeout={500}
                exit={false}
                classNames="video__no-any_state"
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
    const [deleting, deleteVideo] = useDeleteVideo(file);

    return (
        <StyledVideo>
            <div className="name" title={file}>
                {session}
            </div>
            <div className="video">
                <div className="controls">
                    <div className="control">
                        <a href={src}>
                            <i title="Link" className="icon dripicons-link" />
                        </a>
                    </div>
                    <div className="control">
                        {deleting ? (
                            <BeatLoader size={2} color={"#fff"} />
                        ) : (
                            <span className="delete" onClick={deleteVideo}>
                                <i title="Delete" className="icon dripicons-trash" />
                            </span>
                        )}
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
