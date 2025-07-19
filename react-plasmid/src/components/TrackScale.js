import React, { useRef, useEffect, useCallback } from 'react';
import { pathScale, elementScaleLabels, Numeric, createSVGNode } from '../utils/svgUtils';

const TrackScale = ({ 
    interval, 
    vadjust = 0, 
    ticksize = 3, 
    direction = 'out', 
    showlabels = false, 
    labelvadjust = 15, 
    labelclass, 
    labelstyle, 
    tickclass, 
    tickstyle, 
    scaleclick,
    trackContext 
}) => {
    const pathRef = useRef(null);
    const groupRef = useRef(null);

    const scaleInterval = Numeric(interval);
    const scaleVadjust = Numeric(vadjust);
    const scaleTicksize = Numeric(ticksize, 3);
    const scaleLabelvadjust = Numeric(labelvadjust, 15);
    const inwardflg = direction === 'in';
    const showLabelsFlag = showlabels === "1" || showlabels === true;

    const radius = (inwardflg ? trackContext.radius : trackContext.radius + trackContext.width) + 
                   ((inwardflg ? -1 : 1) * scaleVadjust) + 
                   (inwardflg ? -scaleTicksize : 0);

    const labelradius = radius + (scaleLabelvadjust * (inwardflg ? -1 : 1));
    const total = trackContext.plasmid.sequencelength;

    const draw = useCallback(() => {
        if (!pathRef.current || !trackContext) return;
        
        const center = trackContext.center;
        const path = pathScale(center.x, center.y, radius, scaleInterval, total, scaleTicksize);
        
        pathRef.current.setAttribute("d", path);
        
        if (tickclass) {
            pathRef.current.setAttribute("class", tickclass);
        }
        if (tickstyle) {
            pathRef.current.setAttribute("style", tickstyle);
        }

        if (showLabelsFlag) {
            drawLabel();
        } else if (groupRef.current) {
            groupRef.current.innerHTML = '';
        }
    }, [trackContext, radius, scaleInterval, total, scaleTicksize, tickclass, tickstyle, showLabelsFlag]);

    const drawLabel = useCallback(() => {
        if (!groupRef.current || !trackContext) return;
        
        const center = trackContext.center;
        const labels = elementScaleLabels(center.x, center.y, labelradius, scaleInterval, total);
        
        groupRef.current.innerHTML = '';
        
        labels.forEach(label => {
            const textElement = createSVGNode('text');
            
            if (labelclass) {
                textElement.setAttribute('class', labelclass);
            }
            if (labelstyle) {
                textElement.setAttribute('style', labelstyle);
            }
            
            textElement.setAttribute("x", label.x);
            textElement.setAttribute("y", label.y);
            textElement.setAttribute("text-anchor", "middle");
            textElement.setAttribute("alignment-baseline", "middle");
            textElement.textContent = label.text;
            
            textElement.addEventListener("click", (e) => {
                if (scaleclick) {
                    scaleclick(e, { interval: scaleInterval, total });
                }
            });
            
            groupRef.current.appendChild(textElement);
        });
    }, [trackContext, labelradius, scaleInterval, total, labelclass, labelstyle, scaleclick]);

    useEffect(() => {
        if (trackContext) {
            trackContext.addScale({ draw });
        }
    }, [trackContext]);

    useEffect(() => {
        draw();
    }, [trackContext, radius, scaleInterval, total, scaleTicksize, tickclass, tickstyle, showLabelsFlag]);

    const handleClick = (e) => {
        if (scaleclick) {
            scaleclick(e, { interval: scaleInterval, total });
        }
    };

    return (
        <g>
            <path 
                ref={pathRef}
                onClick={handleClick}
            />
            <g ref={groupRef}></g>
        </g>
    );
};

export default TrackScale;
