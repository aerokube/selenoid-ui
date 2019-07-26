import React from "react";
import { StyledBrowser } from "./style.css";

/**
 * Color depending on percentage
 * @param percentile unsigned integer
 * @returns {string} HEX color
 */
function countColor(percentile) {
    const pct = (percentile > 100 ? 100 : percentile) / 100;
    const percentColors = [
        { pct: 0.0, color: { r: 0x41, g: 0x59, b: 0xD3 } }, //#4159D3
        { pct: 0.3, color: { r: 0x66, g: 0x9D, b: 0x9E } }, //#F09876
        { pct: 0.5, color: { r: 0x66, g: 0x9D, b: 0x9E } }, //#A44057
        { pct: 0.7, color: { r: 0xEB, g: 0xA8, b: 0x98 } }, //#EBA898
        { pct: 1.0, color: { r: 0xE8, g: 0x78, b: 0x6F } } //#E8786F
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


const Browser = ({ name, used, totalUsed }) => {
    const perc = totalUsed > 0 ? (used / totalUsed * 100).toFixed() : 0;

    return (
        <StyledBrowser>
            <div className="stats">
                <div className="percent">{perc}%</div>
                <div className="count">{used}</div>
                <div className="name">{name}</div>
            </div>
            <div className="usage-bar"
                 style={{ width: `${perc}%`, borderBottomColor: countColor(perc) }}/>
        </StyledBrowser>
    );
};

export default Browser;
