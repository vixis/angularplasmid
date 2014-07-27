/*global angular*/
(function () {
    'use strict';

    angular.module("angularplasmid", ["angularplasmid.services"])

        .directive("plasmidapi", ['SVGUtil', function (SVGUtil) {
            return {
                restrict: "AE",
                link : function (scope, elem, attr) {
                    scope[attr.name] = SVGUtil.api;
                }
            };
        }])

        .directive("plasmid", ['SVGUtil', function (SVGUtil) {
            return {
                restrict: 'AE',
                type : 'svg',
                template : '<svg></svg>',
                replace : true,
                transclude: true,
                require: 'plasmid',
                scope: {
                    plasmidheight : '@',
                    plasmidwidth : '@',
                    sequencelength : '@',
                    sequence : '@'
                },
                link : {
                    pre : function (scope, elem, attr, plasmidController) {
                        plasmidController.init(elem);
                    },
                    post : function (scope, elem, attrs, plasmidController, transcludeFn) {

                        // Manually transclude children elements
                        transcludeFn(scope.$parent, function (content) {
                            elem.append(content);
                        });

                        // Watch for changes to plasmid
                        scope.$watchGroup(['plasmidheight', 'plasmidwidth', 'sequencelength', 'sequence'], function () {plasmidController.draw(); });
                    }
                },
                controller : ['$scope', 'SVGUtil', function ($scope, SVGUtil) {
                    var element, plasmid, tracks = [];

                    plasmid = this;

                    plasmid.init = function (elem) {
                        SVGUtil.api.addPlasmid(plasmid);
                        element = elem;
                    };

                    plasmid.draw = function () {
                        var d = plasmid.dimensions;
                        element.attr("height", d.height);
                        element.attr("width", d.width);
                        angular.forEach(tracks, function (t) {
                            t.draw();
                        });
                    };

                    plasmid.addTrack = function (track) {
                        tracks.push(track);
                    };

                    Object.defineProperty(plasmid, "center", {
                        get: function () {
                            var d = plasmid.dimensions;
                            return {
                                x : d.width / 2,
                                y : d.height / 2
                            };
                        }
                    });
                    Object.defineProperty(plasmid, "dimensions", {
                        get: function () {
                            return {
                                height : SVGUtil.util.Numeric($scope.plasmidheight),
                                width : SVGUtil.util.Numeric($scope.plasmidwidth)
                            };
                        }
                    });
                    Object.defineProperty(plasmid, "sequencelength", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.sequencelength);
                        }
                    });
                    Object.defineProperty(plasmid, "sequence", {
                        get: function () {
                            return $scope.sequence;
                        }
                    });
                    plasmid.tracks = tracks;
                }]
            };
        }])

         .directive("plasmidtrack", ['SVGUtil', function (SVGUtil) {
            return {
                restrict: 'AE',
                type : 'svg',
                template: '<g><path></path></g>',
                replace : true,
                transclude: true,
                require: ['plasmidtrack', '^plasmid'],
                scope: {
                    radius: '@',
                    width: '@'
                },
                link : {
                    pre : function (scope, elem, attr, controllers, transcludeFn) {
                        var trackController = controllers[0], plasmidController = controllers[1], pathElem = angular.element(elem.children()[0]);
                        trackController.init(pathElem, plasmidController);
                    },
                    post : function (scope, elem, attr, controllers, transcludeFn) {

                        // Manually transclude children elements
                        transcludeFn(scope.$parent, function (content) {
                            elem.append(content);
                        });

                        // Apply special style to path to allow for correct display and apply directive's properties (class, style, id, name) to the path instead of the g
                        var g = angular.element(elem), path  = angular.element(elem.children()[0]), trackController = controllers[0];
                        SVGUtil.util.swapProperties(g, path);
                        path.attr("fill-rule", "evenodd");

                        // Watch for changes in the track
                        scope.$watchGroup(['radius', 'width'], function () {trackController.draw(); });
                    }
                },
                controller : ['$scope', function ($scope) {
                    var plasmid, element, plasmidTrack, markers = [], scales = [];

                    plasmidTrack = this;

                    plasmidTrack.init = function (elem, plasmidCtrl) {
                        plasmid = plasmidCtrl;
                        plasmid.addTrack(this);
                        plasmidTrack.plasmid = plasmid;
                        element = elem;
                    };

                    plasmidTrack.draw = function () {
                        var center = plasmidTrack.center,
                            path = SVGUtil.svg.path.donut(center.x, center.y, plasmidTrack.radius, plasmidTrack.width);
                        element.attr("d", path);
                        angular.forEach(markers, function (m) {
                            m.draw();
                        });
                        angular.forEach(scales, function (s) {
                            s.draw();
                        });
                    };

                    plasmidTrack.addMarker = function (marker) {
                        markers.push(marker);
                    };

                    plasmidTrack.addScale = function (scale) {
                        scales.push(scale);
                    };

                    plasmidTrack.markergroup = function (groupName) {
                        var items = [];
                        angular.forEach(markers, function (marker) {
                            if (marker.markergroup === groupName) {
                                items.push(marker);
                            }
                        });
                        return items;
                    };

                    plasmidTrack.getPosition = function (pos, positionOption, radiusAdjust) {
                        radiusAdjust = Number(radiusAdjust || 0);
                        pos = Number(pos);

                        var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2,
                            radius, angle, center = plasmidTrack.center,
                            seqLen = plasmid.sequencelength;

                        if (seqLen > 0) {
                            angle = (pos / seqLen) * 360;

                            switch (positionOption) {
                            case POSITION_OPTION_INNER:
                                radius = plasmidTrack.radius + radiusAdjust;
                                break;
                            case POSITION_OPTION_OUTER:
                                radius = plasmidTrack.radius + plasmidTrack.width + radiusAdjust;
                                break;
                            default:
                                radius = plasmidTrack.radius + (plasmidTrack.width / 2) + radiusAdjust;
                                break;
                            }
                            return SVGUtil.util.polarToCartesian(center.x, center.y, radius, angle);
                        }
                    };
                    Object.defineProperty(plasmidTrack, "center", {
                        get: function () {
                            return plasmid.center;
                        }
                    });
                    Object.defineProperty(plasmidTrack, "radius", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.radius);
                        }
                    });
                    Object.defineProperty(plasmidTrack, "width", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.width, 25);
                        }
                    });

                    plasmidTrack.markers = markers;
                    plasmidTrack.scales = scales;

                }]
            };
        }])

         .directive("trackscale", ['SVGUtil', function (SVGUtil) {
            return {
                restrict: 'AE',
                type : 'svg',
                template: '<g><path></path><g></g></g>',
                replace : true,
                transclude: true,
                require: ['trackscale', '^plasmidtrack'],
                scope: {
                    interval: "@",
                    vadjust: "@",
                    ticksize: "@",
                    direction: "@",
                    showlabels : "@",
                    labelvadjust : "@",
                    labelclass : "@",
                    labelstyle : "@"
                },
                link : {
                    pre : function (scope, elem, attr, controllers, transcludeFn) {
                        var scaleController = controllers[0], trackController = controllers[1], pathElem = angular.element(elem.children()[0]), groupElem = angular.element(elem.children()[1]);
                        scaleController.init(pathElem, groupElem, trackController);
                    },
                    post : function (scope, elem, attr, controllers, transcludeFn) {

                        var g, path, scaleController;

                        //Manually transclude children elements
                        transcludeFn(scope.$parent, function (content) {
                            elem.append(content);
                        });

                        //Apply directive's properties (class, style, id, name) to the path instead of the g
                        g = angular.element(elem);
                        path  = angular.element(elem.children()[0]);
                        SVGUtil.util.swapProperties(g, path);

                        // Watch for changes to scale
                        scaleController = controllers[0];
                        scope.$watchGroup(['interval', 'vadjust', 'ticksize', 'labelvadjust'], function () {scaleController.draw(); });


                    }
                },
                controller : ['$scope', function ($scope) {
                    var track, trackScale, element, groupElement,
                        DEFAULT_LABELVADJUST = 15, DEFAULT_TICKSIZE = 3;

                    trackScale = this;

                    trackScale.init = function (elem, groupElem, trackCtrl) {
                        track = trackCtrl;
                        track.addScale(trackScale);
                        trackScale.track = track;
                        element = elem;
                        groupElement = groupElem;
                    };

                    trackScale.draw = function () {
                        var center = track.center,
                            path = SVGUtil.svg.path.scale(center.x, center.y, trackScale.radius, trackScale.interval, trackScale.total, trackScale.ticksize);

                        element.attr("d", path);
                        if (trackScale.showlabels) {
                            trackScale.drawLabel();
                        }
                    };

                    trackScale.drawLabel = function () {
                        var i, t, labels, center = track.center;

                        labels = SVGUtil.svg.element.scalelabels(center.x, center.y, trackScale.labelradius, trackScale.interval, trackScale.total);
                        groupElement.empty();
                        for (i = 0; i <= labels.length - 1; i += 1) {
                            t = angular.element(SVGUtil.svg.createNode('text'));
                            if (trackScale.labelclass) { t.attr('class', trackScale.labelclass); }
                            if (trackScale.labelstyle) { t.attr('style', trackScale.labelstyle); }
                            t.attr("x", labels[i].x);
                            t.attr("y", labels[i].y);
                            t.css("text-anchor", "middle");
                            t.css("alignment-baseline", "middle");
                            t.text(labels[i].text);
                            groupElement.append(t);
                        }
                    };
                    Object.defineProperty(trackScale, "radius", {
                        get: function () {
                            return (trackScale.inwardflg ? track.radius : track.radius + track.width) +  ((trackScale.inwardflg ? -1 : 1) * trackScale.vadjust) + (trackScale.inwardflg ? -(trackScale.ticksize) : 0);
                        }
                    });
                    Object.defineProperty(trackScale, "interval", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.interval);
                        }
                    });
                    Object.defineProperty(trackScale, "vadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.vadjust);
                        }
                    });
                    Object.defineProperty(trackScale, "ticksize", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.ticksize, DEFAULT_TICKSIZE);
                        }
                    });
                    Object.defineProperty(trackScale, "inwardflg", {
                        get: function () {
                            return $scope.direction === 'in' ? true : false;
                        }
                    });
                    Object.defineProperty(trackScale, "total", {
                        get: function () {
                            return track.plasmid.sequencelength;
                        }
                    });
                    Object.defineProperty(trackScale, "showlabels", {
                        get: function () {
                            return $scope.showlabels === "1" ? true : false;
                        }
                    });
                    Object.defineProperty(trackScale, "labelvadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.labelvadjust, DEFAULT_LABELVADJUST);
                        }
                    });
                    Object.defineProperty(trackScale, "labelclass", {
                        get: function () {
                            return $scope.labelclass;
                        }
                    });
                    Object.defineProperty(trackScale, "labelstyle", {
                        get: function () {
                            return $scope.labelstyle;
                        }
                    });
                    Object.defineProperty(trackScale, "labelradius", {
                        get: function () {
                            return trackScale.radius + (trackScale.labelvadjust * (trackScale.inwardflg ? -1 : 1));
                        }
                    });
                }]
            };
        }])

         .directive("trackmarker", ['SVGUtil', function (SVGUtil) {
            return {
                restrict: 'AE',
                type : 'svg',
                template: '<g><path></path></g>',
                replace : true,
                transclude: true,
                require: ['trackmarker', '^plasmidtrack'],
                scope: {
                    start: "@",
                    end: "@",
                    vadjust: "@",
                    wadjust: "@",
                    markergroup: "@",
                    arrowstartlength : "@",
                    arrowstartwidth : "@",
                    arrowstartangle : "@",
                    arrowendlength : "@",
                    arrowendwidth : "@",
                    arrowendangle : "@",
                    markerclick: "&"
                },
                link : {
                    pre : function (scope, elem, attr, controllers, transcludeFn) {
                        var markerController = controllers[0], trackController = controllers[1], pathElem = angular.element(elem.children()[0]);
                        markerController.init(pathElem, trackController);
                    },
                    post : function (scope, elem, attr, controllers, transcludeFn) {

                        var markerController = controllers[0], g, path;

                        //Manually transclude children elements
                        transcludeFn(scope.$parent, function (content) {
                            elem.append(content);
                        });

                        //Apply directive's properties (class, style, id, name) to the path instead of the g
                        g = angular.element(elem);
                        path  = angular.element(elem.children()[0]);
                        SVGUtil.util.swapProperties(g, path);

                        //Attach event handlers
                        path.on("click", function (e) {
                            scope.markerclick({
                                $e: e,
                                $marker: markerController
                            });
                        });

                        // Watch for changes to marker
                        scope.$watchGroup(['start', 'end', 'vadjust', 'wadjust'], function () {markerController.draw(); });

                    }
                },
                controller : ['$scope', function ($scope) {
                    var track, marker, element, markerLabels = [];

                    marker = this;

                    marker.init = function (elem, trackCtrl) {
                        track = trackCtrl;
                        track.addMarker(this);
                        element = elem;
                        marker.track = track;
                    };

                    marker.draw = function () {
                        element.attr("d", marker.getPath());
                        angular.forEach(markerLabels, function (markerLabel) {
                            markerLabel.draw();
                        });
                    };

                    marker.addMarkerLabel = function (markerLabel) {
                        markerLabels.push(markerLabel);
                    };

                    marker.getPath = function () {
                        var center = track.center, angle = marker.angle, radius = marker.radius;
                        return SVGUtil.svg.path.arc(center.x, center.y, radius.inner, angle.start, angle.end, marker.width, marker.arrowstart, marker.arrowend);
                    };

                    marker.getPosition = function (hAdjust, vAdjust, hAlign, vAlign) {
                        var HALIGN_MIDDLE = "middle", HALIGN_START = "start", HALIGN_END = "end",
                            VALIGN_MIDDLE = "middle", VALIGN_INNER = "inner", VALIGN_OUTER = "outer",
                            center, radius, angle, markerRadius, markerAngle;

                        center = track.center;
                        markerRadius = marker.radius;
                        markerAngle = marker.angle;
                        hAdjust = SVGUtil.util.Numeric(hAdjust);
                        vAdjust = SVGUtil.util.Numeric(vAdjust);

                        if (vAlign !== undefined && hAlign !== undefined) {
                            switch (vAlign) {
                            case VALIGN_INNER:
                                radius =  markerRadius.inner + vAdjust;
                                break;
                            case VALIGN_OUTER:
                                radius =  markerRadius.outer + vAdjust;
                                break;
                            default:
                                radius =  markerRadius.middle + vAdjust;
                                break;
                            }

                            switch (hAlign) {
                            case HALIGN_START:
                                angle = markerAngle.start + hAdjust;
                                break;
                            case HALIGN_END:
                                angle = markerAngle.end + hAdjust;
                                break;
                            default:
                                angle = markerAngle.middle + hAdjust;
                                break;
                            }

                            return SVGUtil.util.polarToCartesian(center.x, center.y, radius, angle);
                        } else {

                            radius = {
                                outer : markerRadius.outer + vAdjust,
                                inner : markerRadius.inner + vAdjust,
                                middle : markerRadius.middle + vAdjust
                            };

                            angle = {
                                begin : markerAngle.start + hAdjust,
                                end : markerAngle.end + hAdjust,
                                middle : markerAngle.middle + hAdjust
                            };


                            return {
                                outer : {
                                    begin: SVGUtil.util.polarToCartesian(center.x, center.y, radius.outer, angle.begin),
                                    middle: SVGUtil.util.polarToCartesian(center.x, center.y, radius.outer, angle.middle),
                                    end: SVGUtil.util.polarToCartesian(center.x, center.y, radius.outer, angle.end)
                                },
                                middle : {
                                    begin: SVGUtil.util.polarToCartesian(center.x, center.y, radius.middle, angle.begin),
                                    middle: SVGUtil.util.polarToCartesian(center.x, center.y, radius.middle, angle.middle),
                                    end: SVGUtil.util.polarToCartesian(center.x, center.y, radius.middle, angle.end)
                                },
                                inner : {
                                    begin: SVGUtil.util.polarToCartesian(center.x, center.y, radius.inner, angle.begin),
                                    middle: SVGUtil.util.polarToCartesian(center.x, center.y, radius.inner, angle.middle),
                                    end: SVGUtil.util.polarToCartesian(center.x, center.y, radius.inner, angle.end)
                                }
                            };
                        }

                    };
                    Object.defineProperty(marker, "center", {
                        get: function () {
                            return track.center;
                        }
                    });
                    Object.defineProperty(marker, "radius", {
                        get: function () {
                            return {
                                inner : track.radius + marker.vadjust,
                                outer : track.radius + marker.vadjust + marker.width,
                                middle : track.radius + marker.vadjust + marker.width / 2
                            };
                        }
                    });
                    Object.defineProperty(marker, "angle", {
                        get: function () {
                            var startAngle, endAngle, midAngle, end;

                            startAngle = (marker.start / track.plasmid.sequencelength) * 360;

                            end = $scope.end || $scope.start;
                            endAngle = (SVGUtil.util.Numeric(end) / track.plasmid.sequencelength) * 360;
                            endAngle += (endAngle < startAngle) ? 360 : 0;

                            midAngle = startAngle + ((endAngle - startAngle) / 2);

                            return {
                                start : startAngle,
                                middle : midAngle,
                                end : endAngle
                            };
                        }
                    });
                    Object.defineProperty(marker, "vadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.vadjust);
                        }
                    });
                    Object.defineProperty(marker, "wadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.wadjust);
                        }
                    });
                    Object.defineProperty(marker, "width", {
                        get: function () {
                            return track.width + marker.wadjust;
                        }
                    });
                    Object.defineProperty(marker, "start", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.start);
                        }
                    });
                    Object.defineProperty(marker, "end", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.end);
                        }
                    });
                    Object.defineProperty(marker, "arrowstart", {
                        get: function () {
                            return {
                                width : SVGUtil.util.Numeric($scope.arrowstartwidth),
                                length : SVGUtil.util.Numeric($scope.arrowstartlength),
                                angle : SVGUtil.util.Numeric($scope.arrowstartangle)
                            };
                        }
                    });
                    Object.defineProperty(marker, "arrowend", {
                        get: function () {
                            return {
                                width : SVGUtil.util.Numeric($scope.arrowendwidth),
                                length : SVGUtil.util.Numeric($scope.arrowendlength),
                                angle : SVGUtil.util.Numeric($scope.arrowendangle)
                            };
                        }
                    });
                    Object.defineProperty(marker, "markergroup", {
                        get: function () {
                            return $scope.markergroup;
                        }
                    });

                    marker.labels = markerLabels;

                }]
            };
        }])

        .directive("markerlabel", ['SVGUtil', function (SVGUtil) {

            return {
                restrict: 'AE',
                type : 'svg',
                transclude: true,
                template: function (elem, attr) {
                    return (attr.type === 'path') ? '<g><path></path><path id="" style="fill:none;stroke:none"></path><text><textpath xlink:href="#">{{text}}</textpath></text></g>' : '<g><path></path><text>{{text}}</text></g>';
                },
                require: ['markerlabel', '^trackmarker'],
                replace : true,
                scope: {
                    text : "@",
                    valign : "@",
                    vadjust : "@",
                    halign : "@",
                    hadjust : "@",
                    type : "@",
                    showline : "@",
                    linestyle : "@",
                    lineclass : "@",
                    linevadjust : "@"
                },
                link: {
                    pre : function (scope, elem, attr, controllers, transcludeFn) {
                        var markerlabelController = controllers[0], trackMarkerController = controllers[1],
                            groupElem, pathElem, textElem, lineElem;
                        if (attr.type === 'path') {
                            groupElem = angular.element(elem[0]);
                            lineElem = angular.element(elem.children()[0]);
                            pathElem = angular.element(elem.children()[1]);
                            textElem = angular.element(elem.children()[2]);
                        } else {
                            groupElem = angular.element(elem[0]);
                            lineElem = angular.element(elem.children()[0]);
                            textElem = angular.element(elem.children()[1]);
                        }
                        markerlabelController.init(textElem, groupElem, pathElem, lineElem, trackMarkerController);
                    },
                    post : function (scope, elem, attr, controllers, transcludeFn) {
                        transcludeFn(scope.$parent, function (content) {
                            elem.append(content);
                        });

                        //Apply directive's properties (class, style, id, name) to the text
                        var g = angular.element(elem), text = (attr.type === 'path') ? angular.element(elem.children()[2]) : angular.element(elem.children()[1]);
                        text.attr("text-anchor", "middle");
                        text.attr("alignment-baseline", "middle");
                        SVGUtil.util.swapProperties(g, text);
                    }
                },
                controller : ['$scope', function ($scope) {
                    var marker, markerLabel, textElement, pathElement, lineElement, groupElement;

                    markerLabel = this;

                    markerLabel.init = function (textElem, groupElem, pathElem, lineElem, markerCtrl) {
                        marker = markerCtrl;
                        marker.addMarkerLabel(markerLabel);
                        markerLabel.marker = marker;
                        textElement = textElem;
                        pathElement = pathElem;
                        lineElement = lineElem;
                        groupElement = groupElem;
                    };

                    markerLabel.draw = function () {
                        var VALIGN_MIDDLE = "middle", VALIGN_INNER = "inner", VALIGN_OUTER = "outer",
                            HALIGN_MIDDLE = "middle", HALIGN_START = "start", HALIGN_END = "end",
                            textPathElem, fontSize, fontAdjust, id, pos, markerAngle, src, dst, dstPos, dstV;

                        if (markerLabel.type === 'path') {
                            textPathElem = angular.element(textElement.children()[0]);
                            fontSize = window.getComputedStyle(textElement[0]).fontSize.replace("px", "");
                            fontAdjust = (markerLabel.valign === VALIGN_OUTER) ? 0 : (markerLabel.valign === VALIGN_INNER) ? Number(fontSize || 0) : Number(fontSize || 0) / 2;

                            pathElement.attr("d", markerLabel.getPath(markerLabel.hadjust, markerLabel.vadjust - fontAdjust, markerLabel.halign, markerLabel.valign));

                            switch (markerLabel.halign) {
                            case HALIGN_START:
                                textElement.attr("text-anchor", "start");
                                textPathElem[0].setAttribute("startOffset", "0%"); //jQuery can't handle case sensitive names
                                break;
                            case HALIGN_END:
                                textElement.attr("text-anchor", "end");
                                textPathElem[0].setAttribute("startOffset", "100%");//jQuery can't handle case sensitive names
                                break;
                            default:
                                textElement.attr("text-anchor", "middle");
                                textPathElem[0].setAttribute("startOffset", "50%");//jQuery can't handle case sensitive names
                                break;
                            }
                            id = 'TPATH' + (Math.random() + 1).toString(36).substring(3, 7);
                            pathElement.attr("id", id);
                            textPathElem.attr("xlink:href", '#' + id);
                        } else {
                            pos = marker.getPosition(markerLabel.hadjust, markerLabel.vadjust, markerLabel.halign, markerLabel.valign);
                            textElement.attr("x", pos.x);
                            textElement.attr("y", pos.y);
                        }

                        if (markerLabel.showlineflg) {

                            src = marker.getPosition(markerLabel.hadjust, markerLabel.vadjust + markerLabel.linevadjust, markerLabel.halign, markerLabel.valign);

                            dstPos = marker.getPosition();
                            dstV = markerLabel.valign === VALIGN_INNER ? dstPos.inner : markerLabel.valign === VALIGN_MIDDLE ? dstPos.middle : dstPos.outer;
                            dst = markerLabel.halign === HALIGN_START ? dstV.begin : markerLabel.halign === HALIGN_END ? dstV.end : dstV.middle;

                            lineElement.attr("d", ["M", src.x, src.y, "L", dst.x, dst.y].join(" "));
                            if (!markerLabel.linestyle && !markerLabel.lineclass) { lineElement.attr("style", "stroke:#000"); }
                            if (markerLabel.linestyle) { lineElement.attr("style", markerLabel.linestyle); }
                            if (markerLabel.lineclass) { lineElement.attr("class", markerLabel.lineclass); }
                        }
                    };

                    markerLabel.getPath = function (hAdjust, vAdjust, hAlign, vAlign) {
                        var VALIGN_MIDDLE = "middle", VALIGN_INNER = "inner", VALIGN_OUTER = "outer",
                            HALIGN_MIDDLE = "middle", HALIGN_START = "start", HALIGN_END = "end",
                            center = marker.center,
                            radius, markerRadius, markerAngle, startAngle, endAngle;

                        markerRadius = marker.radius;
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

                        markerAngle = marker.angle;
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

                        return SVGUtil.svg.path.arc(center.x, center.y, radius + Number(vAdjust || 0), startAngle + Number(hAdjust || 0), endAngle + Number(hAdjust || 0), 1);
                    };
                    Object.defineProperty(markerLabel, "showlineflg", {
                        get: function () {
                            return ($scope.showline === "1" ? true : false);
                        }
                    });
                    Object.defineProperty(markerLabel, "halign", {
                        get: function () {
                            return $scope.halign || "middle";
                        }
                    });
                    Object.defineProperty(markerLabel, "valign", {
                        get: function () {
                            return $scope.valign || "middle";
                        }
                    });
                    Object.defineProperty(markerLabel, "hadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.hadjust);
                        }
                    });
                    Object.defineProperty(markerLabel, "vadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.vadjust);
                        }
                    });
                    Object.defineProperty(markerLabel, "type", {
                        get: function () {
                            return $scope.type;
                        }
                    });
                    Object.defineProperty(markerLabel, "linevadjust", {
                        get: function () {
                            return SVGUtil.util.Numeric($scope.linevadjust);
                        }
                    });
                    Object.defineProperty(markerLabel, "linestyle", {
                        get: function () {
                            return $scope.linestyle;
                        }
                    });
                    Object.defineProperty(markerLabel, "lineclass", {
                        get: function () {
                            return $scope.lineclass;
                        }
                    });
                    Object.defineProperty(markerLabel, "text", {
                        get: function () {
                            return $scope.text;
                        }
                    });
                }]
            };
        }])

        .directive("spinner", function () {
            return {
                restrict: "A",
                scope: {
                    ngModel: "="
                },
                link: function (scope, elem, attr) {
                    elem.bind('keydown keypress', function (e) {
                        if (e.which === 38) {
                            scope.$apply(function () {
                                scope.ngModel = Number(scope.ngModel) - 6;
                            });
                        } else if (e.which === 40) {
                            scope.$apply(function () {
                                scope.ngModel = Number(scope.ngModel) + 6;
                            });
                        }
                    });
                }
            };
        });

}());

