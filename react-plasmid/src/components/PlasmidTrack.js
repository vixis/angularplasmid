import React, { useRef, useEffect, useState, useCallback } from 'react';
import { pathDonut, Numeric, polarToCartesian } from '../utils/svgUtils';

const PlasmidTrack = ({ 
    radius = 100, 
    width = 25, 
    trackclass, 
    trackstyle, 
    trackclick,
    plasmidContext,
    children 
}) => {
    const pathRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [scales, setScales] = useState([]);
    const [labels, setLabels] = useState([]);

    const trackRadius = Numeric(radius, 100);
    const trackWidth = Numeric(width, 25);

    const addMarker = useCallback((marker) => {
        setMarkers(prev => [...prev, marker]);
    }, []);

    const addScale = useCallback((scale) => {
        setScales(prev => [...prev, scale]);
    }, []);

    const addLabel = useCallback((label) => {
        setLabels(prev => [...prev, label]);
    }, []);

    const getPosition = useCallback((pos, positionOption, radiusAdjust = 0) => {
        const POSITION_OPTION_MID = 0;
        const POSITION_OPTION_INNER = 1;
        const POSITION_OPTION_OUTER = 2;
        
        pos = Number(pos);
        radiusAdjust = Number(radiusAdjust);
        
        const center = plasmidContext.center;
        const seqLen = plasmidContext.sequencelength;
        
        if (seqLen > 0) {
            const angle = (pos / seqLen) * 360;
            let calculatedRadius;
            
            switch (positionOption) {
                case POSITION_OPTION_INNER:
                    calculatedRadius = trackRadius + radiusAdjust;
                    break;
                case POSITION_OPTION_OUTER:
                    calculatedRadius = trackRadius + trackWidth + radiusAdjust;
                    break;
                default:
                    calculatedRadius = trackRadius + (trackWidth / 2) + radiusAdjust;
                    break;
            }
            
            return polarToCartesian(center.x, center.y, calculatedRadius, angle);
        }
    }, [plasmidContext, trackRadius, trackWidth]);

    const draw = useCallback(() => {
        if (!pathRef.current || !plasmidContext) return;
        
        const center = plasmidContext.center;
        const path = pathDonut(center.x, center.y, trackRadius, trackWidth);
        
        pathRef.current.setAttribute("d", path);
        
        if (trackclass) {
            pathRef.current.setAttribute("class", trackclass);
        }
        if (trackstyle) {
            pathRef.current.setAttribute("style", trackstyle);
        }

        markers.forEach(marker => {
            if (marker.draw) marker.draw();
        });
        scales.forEach(scale => {
            if (scale.draw) scale.draw();
        });
        labels.forEach(label => {
            if (label.draw) label.draw();
        });
    }, [plasmidContext, trackRadius, trackWidth, trackclass, trackstyle, markers, scales, labels]);

    useEffect(() => {
        if (plasmidContext) {
            plasmidContext.addTrack({ draw });
        }
    }, [plasmidContext]);

    useEffect(() => {
        draw();
    }, [plasmidContext, trackRadius, trackWidth, trackclass, trackstyle, markers, scales, labels]);

    const handleClick = (e) => {
        if (trackclick) {
            trackclick(e, { 
                radius: trackRadius, 
                width: trackWidth, 
                center: plasmidContext.center,
                getPosition 
            });
        }
    };

    const trackContext = {
        center: plasmidContext.center,
        radius: trackRadius,
        width: trackWidth,
        plasmid: plasmidContext,
        addMarker,
        addScale,
        addLabel,
        getPosition,
        draw
    };

    return (
        <g>
            <path 
                ref={pathRef}
                fillRule="evenodd"
                onClick={handleClick}
            />
            {React.Children.map(children, child => 
                React.cloneElement(child, { trackContext })
            )}
        </g>
    );
};

export default PlasmidTrack;
