import React, { useRef, useEffect, useState, useCallback } from 'react';
import { pathArc, Numeric, polarToCartesian } from '../utils/svgUtils';

const TrackMarker = ({ 
    start, 
    end, 
    vadjust = 0, 
    wadjust = 0, 
    markergroup, 
    arrowstartlength = 0, 
    arrowstartwidth = 0, 
    arrowstartangle = 0, 
    arrowendlength = 0, 
    arrowendwidth = 0, 
    arrowendangle = 0, 
    markerclass, 
    markerstyle, 
    markerclick,
    trackContext,
    children 
}) => {
    const pathRef = useRef(null);
    const [markerLabels, setMarkerLabels] = useState([]);

    const markerStart = Numeric(start);
    const markerEnd = Numeric(end || start);
    const markerVadjust = Numeric(vadjust);
    const markerWadjust = Numeric(wadjust);

    const addMarkerLabel = useCallback((markerLabel) => {
        setMarkerLabels(prev => [...prev, markerLabel]);
    }, []);

    const radius = {
        inner: trackContext.radius + markerVadjust,
        outer: trackContext.radius + markerVadjust + (trackContext.width + markerWadjust),
        middle: trackContext.radius + markerVadjust + (trackContext.width + markerWadjust) / 2
    };

    const angle = (() => {
        const seqLen = trackContext.plasmid.sequencelength;
        let startAngle = (markerStart / seqLen) * 360;
        let endAngle = (markerEnd / seqLen) * 360;
        endAngle += (endAngle < startAngle) ? 360 : 0;
        const midAngle = startAngle + ((endAngle - startAngle) / 2);
        
        return {
            start: startAngle,
            middle: midAngle,
            end: endAngle
        };
    })();

    const arrowstart = {
        width: Numeric(arrowstartwidth),
        length: Numeric(arrowstartlength),
        angle: Numeric(arrowstartangle)
    };

    const arrowend = {
        width: Numeric(arrowendwidth),
        length: Numeric(arrowendlength),
        angle: Numeric(arrowendangle)
    };

    const getPath = useCallback(() => {
        const center = trackContext.center;
        return pathArc(center.x, center.y, radius.inner, angle.start, angle.end, trackContext.width + markerWadjust, arrowstart, arrowend);
    }, [trackContext, radius, angle, markerWadjust, arrowstart, arrowend]);

    const getPosition = useCallback((hAdjust = 0, vAdjust = 0, hAlign, vAlign) => {
        const HALIGN_MIDDLE = "middle";
        const HALIGN_START = "start";
        const HALIGN_END = "end";
        const VALIGN_MIDDLE = "middle";
        const VALIGN_INNER = "inner";
        const VALIGN_OUTER = "outer";

        const center = trackContext.center;
        hAdjust = Numeric(hAdjust);
        vAdjust = Numeric(vAdjust);

        if (vAlign !== undefined && hAlign !== undefined) {
            let calculatedRadius;
            switch (vAlign) {
                case VALIGN_INNER:
                    calculatedRadius = radius.inner + vAdjust;
                    break;
                case VALIGN_OUTER:
                    calculatedRadius = radius.outer + vAdjust;
                    break;
                default:
                    calculatedRadius = radius.middle + vAdjust;
                    break;
            }

            let calculatedAngle;
            switch (hAlign) {
                case HALIGN_START:
                    calculatedAngle = angle.start + hAdjust;
                    break;
                case HALIGN_END:
                    calculatedAngle = angle.end + hAdjust;
                    break;
                default:
                    calculatedAngle = angle.middle + hAdjust;
                    break;
            }

            return polarToCartesian(center.x, center.y, calculatedRadius, calculatedAngle);
        } else {
            const adjustedRadius = {
                outer: radius.outer + vAdjust,
                inner: radius.inner + vAdjust,
                middle: radius.middle + vAdjust
            };

            const adjustedAngle = {
                begin: angle.start + hAdjust,
                end: angle.end + hAdjust,
                middle: angle.middle + hAdjust
            };

            return {
                outer: {
                    begin: polarToCartesian(center.x, center.y, adjustedRadius.outer, adjustedAngle.begin),
                    middle: polarToCartesian(center.x, center.y, adjustedRadius.outer, adjustedAngle.middle),
                    end: polarToCartesian(center.x, center.y, adjustedRadius.outer, adjustedAngle.end)
                },
                middle: {
                    begin: polarToCartesian(center.x, center.y, adjustedRadius.middle, adjustedAngle.begin),
                    middle: polarToCartesian(center.x, center.y, adjustedRadius.middle, adjustedAngle.middle),
                    end: polarToCartesian(center.x, center.y, adjustedRadius.middle, adjustedAngle.end)
                },
                inner: {
                    begin: polarToCartesian(center.x, center.y, adjustedRadius.inner, adjustedAngle.begin),
                    middle: polarToCartesian(center.x, center.y, adjustedRadius.inner, adjustedAngle.middle),
                    end: polarToCartesian(center.x, center.y, adjustedRadius.inner, adjustedAngle.end)
                }
            };
        }
    }, [trackContext, radius, angle]);

    const draw = useCallback(() => {
        if (!pathRef.current) return;
        
        pathRef.current.setAttribute("d", getPath());
        
        if (markerclass) {
            pathRef.current.setAttribute("class", markerclass);
        }
        if (markerstyle) {
            pathRef.current.setAttribute("style", markerstyle);
        }

        markerLabels.forEach(markerLabel => {
            if (markerLabel.draw) markerLabel.draw();
        });
    }, [getPath, markerclass, markerstyle, markerLabels]);

    useEffect(() => {
        if (trackContext) {
            trackContext.addMarker({ draw, getPosition, addMarkerLabel });
        }
    }, [trackContext]);

    useEffect(() => {
        draw();
    }, [getPath, markerclass, markerstyle, markerLabels]);

    const handleClick = (e) => {
        if (markerclick) {
            markerclick(e, { 
                start: markerStart, 
                end: markerEnd, 
                radius, 
                angle, 
                getPosition,
                markergroup 
            });
        }
    };

    const markerContext = {
        center: trackContext.center,
        radius,
        angle,
        start: markerStart,
        end: markerEnd,
        track: trackContext,
        addMarkerLabel,
        getPosition,
        draw
    };

    return (
        <g>
            <path 
                ref={pathRef}
                onClick={handleClick}
            />
            {React.Children.map(children, child => 
                React.cloneElement(child, { markerContext })
            )}
        </g>
    );
};

export default TrackMarker;
