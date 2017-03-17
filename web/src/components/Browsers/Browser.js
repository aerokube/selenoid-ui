import React, {Component} from "react";
import "./style.scss";


export default class Browser extends Component {

    countColor(percentile) {
        const pct = (percentile > 100 ? 100 : percentile) / 100;
        const percentColors = [
            {pct: 0.0, color: {r: 0x41, g: 0x59, b: 0xD3}}, //#4159D3
            {pct: 0.3, color: {r: 0x66, g: 0x9D, b: 0x9E}}, //#F09876
            {pct: 0.5, color: {r: 0x66, g: 0x9D, b: 0x9E}}, //#A44057
            {pct: 0.7, color: {r: 0xEB, g: 0xA8, b: 0x98}}, //#EBA898
            {pct: 1.0, color: {r: 0xE8, g: 0x78, b: 0x6F}} //#E8786F
        ];

        const color = {};

        for (let i = 1; i <= percentColors.length - 1; i++) {
            if (pct < percentColors[i - 1].pct) {
                break;
            }
            const lower = percentColors[i - 1];
            const upper = percentColors[i];

            const range = upper.pct - lower.pct;
            const rangePct = (pct - lower.pct) / range;
            const pctLower = 1 - rangePct;
            const pctUpper = rangePct;

            color.r = Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper);
            color.g = Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper);
            color.b = Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper);
        }

        const colors = [color.r, color.g, color.b]
            .map(col => col.toString(16))
            .join('');

        return `#${colors}`;
    }

    render() {
        const perc = (this.props.used / this.props.totalUsed * 100).toFixed();

        return (
            <div className="browser">
                <div className="browser-stats">
                    <div className="browser-stats__percent">{perc}%</div>
                    <div className="browser-stats__count">{this.props.used}</div>
                    <div className="browser-stats__name">{this.props.name}</div>
                </div>
                <div className="browser-usage-bar"
                     style={{width: `${perc}%`, borderBottomColor: this.countColor(perc)}}></div>
            </div>
        );
    }
}
