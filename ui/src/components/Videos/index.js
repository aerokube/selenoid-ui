import React, { Component } from "react";
import { StyledVideos } from "./style.css";
import SearchResults from "react-filter-search";
import { ajax } from "rxjs/ajax";

export default class Videos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: "",
        };
    }

    componentWillMount() {
        const vids = [];
        this.props.videos.forEach(function(item, index) {
            vids.push({ name: item });
        });

        this.setState({ data: vids });
    }

    handleChange = event => {
        const { value } = event.target;
        this.setState({ value });
    };

    deleteVideo = video => {
        const comp = this;
        ajax({
            url: `/video/${video}`,
            method: "DELETE",
        }).subscribe(
            () => {
                const data = this.state.data.filter(i => i.name !== video);
                comp.setState({ data });
            },
            error => {
                console.error("Can't delete video", video, error);
            }
        );
    };

    render() {
        const { data, value } = this.state;
        const preloadVal = data.length > 100 ? "none" : "auto";

        return (
            <StyledVideos>
                <div className="section-title">Videos</div>
                <div className="filter">
                    <label>
                        Filter:
                        <input type="text" value={value} onChange={this.handleChange} />
                    </label>
                </div>
                <SearchResults
                    value={value}
                    data={data}
                    renderResults={results => (
                        <div className={`videos__list videos__list_count-${data.length}`}>
                            {results.length &&
                                results.map(el => (
                                    <div className="videos-container">
                                        <div className="video-cap video-cap__name" title={el.name}>
                                            <span>{el.name}</span>
                                        </div>
                                        <video controls preload={preloadVal}>
                                            <source src={"/video/" + el.name} type="video/mp4" />
                                        </video>
                                        <div className="video-cap video-cap__buttons">
                                            <a
                                                className="video-cap video-cap__download"
                                                href={"/video/" + el.name}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                                download
                                            >
                                                <span title="Download" className="icon dripicons-download" />
                                            </a>
                                            <button
                                                className="video-cap video-cap__delete"
                                                onClick={() => {
                                                    this.deleteVideo(el.name);
                                                }}
                                            >
                                                <span title="Delete" className="icon dripicons-trash" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                />
            </StyledVideos>
        );
    }
}
