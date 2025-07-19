import React from 'react';
import { Plasmid, PlasmidTrack, TrackMarker, TrackScale, TrackLabel, MarkerLabel } from '../components';

const PUC19Example = () => {
    return (
        <div>
            <style>{`
                @import url("http://fonts.googleapis.com/css?family=Lato:300,400,700|Donegal+One|Source+Code+Pro:400");
                body {font-family: 'Lato';font-weight:400;}
            `}</style>
            
            <Plasmid sequencelength="2686" plasmidheight="375" plasmidwidth="375">
                <PlasmidTrack trackstyle="fill:#c60;stroke:none" radius="125" width="8">
                    <TrackLabel text="pUC19" labelstyle="font-size:30px;font-weight:700" />
                    <TrackLabel text="2686 bp" labelstyle="font-size:18px;font-weight:400" vadjust="25" />

                    <TrackScale interval="500" labelvadjust="20" showlabels="1" labelstyle="font-size:12px" />

                    <TrackMarker 
                        start="80" 
                        end="454" 
                        arrowstartlength="10" 
                        arrowstartwidth="5" 
                        arrowstartangle="3" 
                        vadjust="-10"
                    >
                        <MarkerLabel text="lacZ" vadjust="-30" labelstyle="font-weight:400;font-size:20px" />
                    </TrackMarker>

                    <TrackMarker 
                        start="396" 
                        end="454" 
                        vadjust="-10" 
                        markerstyle="fill:#00f"
                    >
                        <MarkerLabel text="Polylinker" vadjust="-35" labelstyle="font-weight:400;font-size:16px;fill:#00f" />
                        <MarkerLabel text="396-454" vadjust="40" labelstyle="font-weight:400;font-size:14px;fill:#00f" />
                    </TrackMarker>

                    <TrackMarker 
                        start="800" 
                        end="1400" 
                        arrowstartlength="10" 
                        arrowstartwidth="5" 
                        arrowstartangle="3" 
                        vadjust="-10"
                    >
                        <MarkerLabel text="ori" vadjust="-25" labelstyle="font-weight:400;font-size:20px" />
                    </TrackMarker>

                    <TrackMarker 
                        start="1700" 
                        end="2500" 
                        arrowstartlength="10" 
                        arrowstartwidth="5" 
                        arrowstartangle="3" 
                        vadjust="-10"
                    >
                        <MarkerLabel text="amp" vadjust="-30" labelstyle="font-weight:400;font-size:20px" />
                    </TrackMarker>
                </PlasmidTrack>
            </Plasmid>
        </div>
    );
};

export default PUC19Example;
