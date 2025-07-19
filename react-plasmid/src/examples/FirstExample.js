import React from 'react';
import { Plasmid, PlasmidTrack, TrackMarker, TrackScale, TrackLabel, MarkerLabel } from '../components';

const FirstExample = () => {
    const handleMarkerClick = (event, marker) => {
        console.log('Marker clicked:', marker);
    };

    const handleLabelClick = (event, label) => {
        console.log('Label clicked:', label);
    };

    return (
        <div id="home">
            <style>{`
                @import url("//fonts.googleapis.com/css?family=Lato:300,400,700|Donegal+One|Source+Code+Pro:400");

                #home .plasmid .markerhover:hover {
                  stroke: #f00;
                  stroke-width: 2px;
                }
                #home .plasmid .track {
                  fill: #cfd9db;
                  stroke: #c0cdd1;
                }
                #home .plasmid .tracklabelbody {
                  font: 400 20px "Donegal One";
                  fill: #5e7980;
                }
                #home .plasmid .tracklabeltitle {
                  font: 700 40px "Donegal One";
                  fill: #334145;
                }
                #home .plasmid .tracklabelsmall {
                  font: 400 12px "Lato";
                  fill: #5e7980;
                }
                #home .plasmid .scale-major {
                  stroke: #334145;
                  stroke-width: 2px;
                }
                #home .plasmid .scale-minor {
                  stroke: #94aab0;
                }
                #home .plasmid .scale-majortext {
                  font: 300 9px "Lato";
                  fill: #94aab0;
                }
                #home .plasmid .markerlabel {
                  font: 400 9px "Lato";
                  fill: #334145;
                }
                #home .plasmid .featurelabel {
                  font: 700 14px "Lato";
                  fill: #c00;
                }
                #home .plasmid .regionlabel {
                  font: 400 11px "Lato";
                }
                #home .plasmid .noncodingregion {
                  fill: none;
                  stroke: #a3b6bb;
                  stroke-dasharray: 4,2;
                }
                #home .plasmid .noncodinglabel {
                  font: 400 9px "Lato";
                  fill: #5e7980;
                }
            `}</style>
            
            <Plasmid 
                plasmidclass="plasmid" 
                plasmidheight="450" 
                plasmidwidth="600" 
                sequencelength="1000"
            >
                <PlasmidTrack trackclass="track" radius="130" width="25">
                    <TrackLabel labelclass="tracklabeltitle" text="pHS1" vadjust="-10" />
                    <TrackLabel labelclass="tracklabelbody" text="1000 bp" vadjust="25" />
                    <TrackScale interval="10" tickclass="scale-minor" />
                    <TrackScale interval="50" tickclass="scale-major" showlabels="1" labelclass="scale-majortext" />

                    <TrackMarker 
                        start="710" 
                        end="800" 
                        markerclass="noncodingregion" 
                        vadjust="55" 
                        arrowendlength="4" 
                        arrowendwidth="4" 
                        arrowstartlength="4" 
                        arrowstartwidth="4" 
                        wadjust="-10"
                    >
                        <MarkerLabel 
                            labelclass="noncodinglabel" 
                            style="font-weight:400;kerning:2" 
                            text="710 - 800" 
                            type="path" 
                            vadjust="1" 
                        />
                        <MarkerLabel 
                            labelclass="noncodinglabel" 
                            text="Non-Coding" 
                            vadjust="35" 
                            hadjust="0" 
                        />
                        <MarkerLabel 
                            labelclass="noncodinglabel" 
                            text="Region" 
                            vadjust="35" 
                            hadjust="-3" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        start="130" 
                        end="229" 
                        markerstyle="fill:rgba(255,0,0,0.4)" 
                        arrowendlength="4" 
                        wadjust="8" 
                        vadjust="-4" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="FORWARD" 
                            type="path" 
                            labelstyle="fill:#fff" 
                            vadjust="5" 
                        />
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="Primer" 
                            type="path" 
                            labelstyle="fill:#fff" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="75" 
                        markerstyle="stroke:#c00;stroke-width:2px" 
                        wadjust="12" 
                        vadjust="-6"
                    >
                        <MarkerLabel 
                            labelclass="featurelabel" 
                            text="BamHI" 
                            type="path" 
                            valign="outer" 
                            hadjust="-2" 
                            vadjust="38" 
                        />
                        <MarkerLabel 
                            labelclass="featurelabel" 
                            labelstyle="font-size:11px;font-weight:300" 
                            text="Click for details..." 
                            type="path" 
                            valign="outer" 
                            hadjust="-2" 
                            vadjust="25" 
                            showline="1" 
                            linestyle="stroke:#666;stroke-dasharray:2,2" 
                            linevadjust="-10" 
                        />
                        <MarkerLabel 
                            labelclass="featurelabel" 
                            text="75" 
                            type="path" 
                            valign="inner" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="230" 
                        markerstyle="stroke:#c00;stroke-width:2px" 
                        wadjust="12" 
                        vadjust="-6"
                    >
                        <MarkerLabel 
                            labelclass="featurelabel" 
                            text="EcoRI" 
                            type="path" 
                            valign="outer" 
                            hadjust="2" 
                            vadjust="30" 
                            showline="1" 
                            linestyle="stroke:#666;stroke-dasharray:2,2" 
                            linevadjust="-10" 
                        />
                        <MarkerLabel 
                            labelclass="featurelabel" 
                            text="230" 
                            type="path" 
                            valign="inner" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        start="231" 
                        end="350" 
                        markerstyle="fill:rgba(128,0,0,0.4)" 
                        arrowstartlength="4" 
                        wadjust="8" 
                        vadjust="-4" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="REVERSE" 
                            type="path" 
                            labelstyle="fill:#fff" 
                            vadjust="5" 
                        />
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="Primer" 
                            type="path" 
                            labelstyle="fill:#fff" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        start="802" 
                        end="980" 
                        markerstyle="fill:rgba(0,128,0,0.1)" 
                        wadjust="30" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="regionlabel" 
                            text="Sequencing Region" 
                            type="path" 
                            labelstyle="fill:rgba(0,128,0,.6)" 
                            vadjust="40" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="802" 
                        markerstyle="stroke:rgba(0,64,0,0.5);stroke-dasharray:3,1;" 
                        wadjust="30"
                    >
                        <MarkerLabel 
                            labelclass="regionlabel" 
                            text="802" 
                            type="path" 
                            labelstyle="fill:rgba(0,128,0,.6)" 
                            valign="inner" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="980" 
                        markerstyle="stroke:rgba(0,64,0,0.5);stroke-dasharray:3,1;" 
                        wadjust="30"
                    >
                        <MarkerLabel 
                            labelclick={handleLabelClick} 
                            labelclass="regionlabel" 
                            text="980" 
                            type="path" 
                            labelstyle="fill:rgba(0,128,0,.6)" 
                            valign="inner" 
                            vadjust="-5" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="462" 
                        end="712" 
                        markerstyle="fill:rgba(0,0,128,.4)" 
                        vadjust="3" 
                        arrowendlength="4" 
                        arrowendwidth="4" 
                        wadjust="-5"
                    >
                        <MarkerLabel 
                            text="TARGET PROTEINS" 
                            type="path" 
                            labelstyle="fill:rgba(0,0,64,.7);font-family:'Lato';font-size:12px;font-weight:700" 
                            vadjust="45" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        markerstyle="fill:rgba(0,0,128,.4)" 
                        start="482" 
                        end="567" 
                        wadjust="8" 
                        vadjust="-4" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="LEUII" 
                            labelstyle="fill:#fff;font-weight:700" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        markerstyle="fill:rgba(0,0,128,.4)" 
                        start="585" 
                        end="645" 
                        wadjust="8" 
                        vadjust="-4" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="AMPR" 
                            labelstyle="fill:#fff;font-weight:700" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        markerclass="markerhover" 
                        markerstyle="fill:rgba(0,0,128,.4)" 
                        start="661" 
                        end="692" 
                        wadjust="8" 
                        vadjust="-4" 
                        markerclick={handleMarkerClick}
                    >
                        <MarkerLabel 
                            labelclass="markerlabel" 
                            text="ADHI" 
                            labelstyle="fill:#fff;font-weight:700" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="462" 
                        markerstyle="stroke:rgba(0,0,64,.7);stroke-width:2px;stroke-dasharray:4,2" 
                        vadjust="-7" 
                        wadjust="15"
                    >
                        <MarkerLabel 
                            text="462" 
                            labelstyle="fill:rgba(0,0,64,.7);font:700 10px 'Lato'" 
                            vadjust="-35" 
                        />
                    </TrackMarker>

                    <TrackMarker 
                        start="712" 
                        markerstyle="stroke:rgba(0,0,64,.7);stroke-width:2px;stroke-dasharray:4,2" 
                        vadjust="-7" 
                        wadjust="15"
                    >
                        <MarkerLabel 
                            text="712" 
                            labelstyle="fill:rgba(0,0,64,.7);font:700 10px 'Lato'" 
                            vadjust="-35" 
                        />
                    </TrackMarker>
                </PlasmidTrack>
            </Plasmid>
        </div>
    );
};

export default FirstExample;
