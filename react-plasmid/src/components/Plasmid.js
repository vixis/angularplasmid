import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Numeric } from '../utils/svgUtils';

const Plasmid = ({ 
    plasmidheight = 300, 
    plasmidwidth = 300, 
    sequencelength, 
    sequence, 
    plasmidclass, 
    plasmidstyle,
    children 
}) => {
    const svgRef = useRef(null);
    const [tracks, setTracks] = useState([]);

    const dimensions = {
        height: Numeric(plasmidheight, 300),
        width: Numeric(plasmidwidth, 300)
    };

    const center = {
        x: dimensions.width / 2,
        y: dimensions.height / 2
    };

    const actualSequenceLength = sequence ? sequence.length : Numeric(sequencelength);

    const addTrack = useCallback((track) => {
        setTracks(prev => [...prev, track]);
    }, []);

    const draw = useCallback(() => {
        if (!svgRef.current) return;
        
        const svg = svgRef.current;
        svg.setAttribute("height", dimensions.height);
        svg.setAttribute("width", dimensions.width);
        
        if (plasmidclass) {
            svg.setAttribute("class", plasmidclass);
        }
        if (plasmidstyle) {
            svg.setAttribute("style", plasmidstyle);
        }

        tracks.forEach(track => {
            if (track.draw) {
                track.draw();
            }
        });
    }, [dimensions, plasmidclass, plasmidstyle, tracks]);

    useEffect(() => {
        draw();
    }, [draw]);

    const plasmidContext = {
        center,
        dimensions,
        sequencelength: actualSequenceLength,
        sequence,
        addTrack,
        draw
    };

    return (
        <svg 
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            {React.Children.map(children, child => 
                React.cloneElement(child, { plasmidContext })
            )}
        </svg>
    );
};

export default Plasmid;
