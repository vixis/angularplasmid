import React, { useRef, useEffect, useCallback } from 'react';
import { Numeric } from '../utils/svgUtils';

const TrackLabel = ({ 
    text, 
    hadjust = 0, 
    vadjust = 0, 
    labelclass, 
    labelstyle, 
    labelclick,
    trackContext 
}) => {
    const textRef = useRef(null);

    const labelHadjust = Numeric(hadjust, 0);
    const labelVadjust = Numeric(vadjust, 0);

    const draw = useCallback(() => {
        if (!textRef.current || !trackContext) return;
        
        const center = trackContext.center;
        
        textRef.current.setAttribute("x", center.x + labelHadjust);
        textRef.current.setAttribute("y", center.y + labelVadjust);
        textRef.current.textContent = text || '';
        
        if (labelclass) {
            textRef.current.setAttribute("class", labelclass);
        }
        if (labelstyle) {
            textRef.current.setAttribute("style", labelstyle);
        }
    }, [trackContext, labelHadjust, labelVadjust, text, labelclass, labelstyle]);

    useEffect(() => {
        if (trackContext) {
            trackContext.addLabel({ draw });
        }
    }, [trackContext]);

    useEffect(() => {
        draw();
    }, [trackContext, labelHadjust, labelVadjust, text, labelclass, labelstyle]);

    const handleClick = (e) => {
        if (labelclick) {
            labelclick(e, { text, hadjust: labelHadjust, vadjust: labelVadjust });
        }
    };

    return (
        <text 
            ref={textRef}
            textAnchor="middle"
            alignmentBaseline="middle"
            onClick={handleClick}
        />
    );
};

export default TrackLabel;
