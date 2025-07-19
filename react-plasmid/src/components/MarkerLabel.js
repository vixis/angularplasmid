import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Numeric, pathArc, createSVGNode } from '../utils/svgUtils';

const MarkerLabel = ({ 
    text, 
    valign = 'middle', 
    vadjust = 0, 
    halign = 'middle', 
    hadjust = 0, 
    type, 
    showline = false, 
    linestyle, 
    lineclass, 
    labelstyle, 
    labelclass, 
    linevadjust = 0, 
    labelclick,
    markerContext 
}) => {
    const textRef = useRef(null);
    const pathRef = useRef(null);
    const lineRef = useRef(null);
    const groupRef = useRef(null);
    const [textPathElement, setTextPathElement] = useState(null);

    const labelHadjust = Numeric(hadjust);
    const labelVadjust = Numeric(vadjust);
    const labelLinevadjust = Numeric(linevadjust);
    const showlineflg = showline === "1" || showline === true;

    const getPath = useCallback((hAdjust = 0, vAdjust = 0, hAlign = 'middle', vAlign = 'middle') => {
        const VALIGN_MIDDLE = "middle";
        const VALIGN_INNER = "inner";
        const VALIGN_OUTER = "outer";
        const HALIGN_MIDDLE = "middle";
        const HALIGN_START = "start";
        const HALIGN_END = "end";

        const center = markerContext.center;
        const markerRadius = markerContext.radius;
        const markerAngle = markerContext.angle;

        let radius;
        switch (vAlign) {
            case VALIGN_INNER:
                radius = markerRadius.inner;
                break;
            case VALIGN_OUTER:
                radius = markerRadius.outer;
                break;
            default:
                radius = markerRadius.middle;
                break;
        }

        let startAngle, endAngle;
        switch (hAlign) {
            case HALIGN_START:
                startAngle = markerAngle.start;
                endAngle = markerAngle.start + 359.99;
                break;
            case HALIGN_END:
                startAngle = markerAngle.end + 1;
                endAngle = markerAngle.end;
                break;
            default:
                startAngle = markerAngle.middle + 180.05;
                endAngle = markerAngle.middle + 179.95;
                break;
        }

        return pathArc(center.x, center.y, radius + Number(vAdjust || 0), startAngle + Number(hAdjust || 0), endAngle + Number(hAdjust || 0), 1);
    }, [markerContext]);

    const draw = useCallback(() => {
        if (!textRef.current || !markerContext) return;

        const VALIGN_MIDDLE = "middle";
        const VALIGN_INNER = "inner";
        const VALIGN_OUTER = "outer";
        const HALIGN_MIDDLE = "middle";
        const HALIGN_START = "start";
        const HALIGN_END = "end";

        if (labelclass) {
            textRef.current.setAttribute("class", labelclass);
        }
        if (labelstyle) {
            textRef.current.setAttribute("style", labelstyle);
        }

        if (type === 'path') {
            textRef.current.setAttribute("x", '');
            textRef.current.setAttribute("y", '');

            if (!textPathElement && pathRef.current) {
                const textPathSVG = createSVGNode('textPath');
                const pathId = 'TPATH' + Math.random().toString(36).substring(3, 7);
                pathRef.current.setAttribute("id", pathId);
                textPathSVG.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + pathId);
                
                textRef.current.innerHTML = '';
                textRef.current.appendChild(textPathSVG);
                setTextPathElement(textPathSVG);
            }

            if (textPathElement) {
                textPathElement.textContent = text || '';
                
                const fontSize = window.getComputedStyle(textRef.current).fontSize.replace("px", "");
                const fontAdjust = (valign === VALIGN_OUTER) ? 0 : 
                                 (valign === VALIGN_INNER) ? Number(fontSize || 0) : 
                                 Number(fontSize || 0) / 2;
                
                if (pathRef.current) {
                    pathRef.current.setAttribute("d", getPath(labelHadjust, labelVadjust - fontAdjust, halign, valign));
                }

                switch (halign) {
                    case HALIGN_START:
                        textRef.current.setAttribute("text-anchor", "start");
                        textPathElement.setAttribute("startOffset", "0%");
                        break;
                    case HALIGN_END:
                        textRef.current.setAttribute("text-anchor", "end");
                        textPathElement.setAttribute("startOffset", "100%");
                        break;
                    default:
                        textRef.current.setAttribute("text-anchor", "middle");
                        textPathElement.setAttribute("startOffset", "50%");
                        break;
                }
            }
        } else {
            if (textPathElement) {
                textPathElement.remove();
                setTextPathElement(null);
            }
            
            const pos = markerContext.getPosition(labelHadjust, labelVadjust, halign, valign);
            textRef.current.setAttribute("x", pos.x);
            textRef.current.setAttribute("y", pos.y);
            textRef.current.textContent = text || '';
        }

        if (showlineflg && lineRef.current) {
            const src = markerContext.getPosition(labelHadjust, labelVadjust + labelLinevadjust, halign, valign);
            const dstPos = markerContext.getPosition();
            const dstV = valign === VALIGN_INNER ? dstPos.inner : 
                        valign === VALIGN_MIDDLE ? dstPos.middle : dstPos.outer;
            const dst = halign === HALIGN_START ? dstV.begin : 
                       halign === HALIGN_END ? dstV.end : dstV.middle;

            lineRef.current.setAttribute("d", ["M", src.x, src.y, "L", dst.x, dst.y].join(" "));
            
            if (!linestyle && !lineclass) {
                lineRef.current.setAttribute("style", "stroke:#000");
            }
            if (linestyle) {
                lineRef.current.setAttribute("style", linestyle);
            }
            if (lineclass) {
                lineRef.current.setAttribute("class", lineclass);
            }
        } else if (lineRef.current) {
            lineRef.current.removeAttribute("d");
        }
    }, [markerContext, labelHadjust, labelVadjust, labelLinevadjust, text, type, halign, valign, labelclass, labelstyle, showlineflg, linestyle, lineclass, textPathElement, getPath]);

    useEffect(() => {
        if (markerContext) {
            markerContext.addMarkerLabel({ draw });
        }
    }, [markerContext]);

    useEffect(() => {
        draw();
    }, [markerContext, labelHadjust, labelVadjust, labelLinevadjust, text, type, halign, valign, labelclass, labelstyle, showlineflg, linestyle, lineclass, textPathElement, getPath]);

    const handleClick = (e) => {
        if (labelclick) {
            labelclick(e, { text, halign, valign, hadjust: labelHadjust, vadjust: labelVadjust });
        } else if (markerContext.track && markerContext.track.fireClick) {
            markerContext.track.fireClick(e);
        }
    };

    return (
        <g ref={groupRef}>
            <path ref={pathRef} style={{ fill: 'none', stroke: 'none' }} />
            <path ref={lineRef} />
            <text 
                ref={textRef}
                textAnchor="middle"
                alignmentBaseline="middle"
                onClick={handleClick}
            />
        </g>
    );
};

export default MarkerLabel;
