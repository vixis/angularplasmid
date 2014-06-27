app.directive("spinner", function() {
    return {
        restrict: "A",
        scope: {
            ngModel: "="
        },
        link: function(scope, elem, attr) {
            elem.bind('keydown keypress', function(e) {
                if (e.which == 38) {
                    scope.$apply(function() {
                        scope.ngModel = Number(scope.ngModel) - 5;
                    });
                } else if (e.which == 40) {
                    scope.$apply(function() {
                        scope.ngModel = Number(scope.ngModel) + 5;
                    });
                }
            });
        }
    };
});

app.directive("plasmidapi",['PlasmidLib', function(PlasmidLib){
    return {
        restrict: "AE",
        link : function(scope, elem, attr){
            scope[attr.name] = PlasmidLib;
        }
    };
}]);

app.directive("plasmid", ['PlasmidLib','$compile',
    function(PlasmidLib, $compile) {
        return {
            restrict: "AE",
            scope: {
                sequence: '=',
                length: '=',
                height: '=',
                width: '='
            },
            link: {
                pre : function(scope,elem,attrs, plasmidController) {
                    plasmidController.init();
                },
                post : function(scope,elem,attrs,plasmidController){
                    var svg = plasmidController.plasmid.svg;
                    svg.append(elem[0].childNodes);
                    elem.replaceWith(svg);
                }
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var plasmid;

                this.init = function() {
                    plasmid = new PlasmidLib.Plasmid($element, $attrs);
                };

                Object.defineProperty(this,"plasmid",{
                    get: function() {return plasmid;},
                });

                $scope.$watchCollection('[height, width, length, sequence]', function(newValues) {
                    if (newValues && plasmid) {
                        plasmid.height = newValues[0];
                        plasmid.width = newValues[1];
                        plasmid.sequencelength = newValues[2];
                        plasmid.sequence = newValues[3];
                    }
                });
            }]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A track consists of two SVG elements: 
    (1) SVG Group (will be appended to by the track's children)
    (2) the actual track itself. 
------------------------------------------------------------------------------------*/
app.directive("track", ['PlasmidLib',
    function(PlasmidLib) {
        return {
            restrict: 'AE',
            require: ["track", "^plasmid"],
            scope: {
                radius: '=',
                thickness: '='
            },
            link: {
                pre : function(scope, elem, attrs, controllers) {
                    var trackController = controllers[0], plasmidController = controllers[1];
                    trackController.init(plasmidController);
                },
                post :  function(scope, elem, attrs, controllers) {
                    var trackController = controllers[0];
                    var svg = trackController.track.svg;
                    svg.append(elem[0].childNodes);
                    elem.replaceWith(svg);
                }
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

                var track;

                this.init = function(plasmidController) {
                    track = plasmidController.plasmid.addTrack($element,$attrs);
                };

                Object.defineProperty(this,"track",{
                    get: function() {return track;},
                });


                $scope.$watch(
                    function() {
                        return [track.center.x, track.center.y, $scope.radius, $scope.thickness].join();
                    },
                    function(newValue) {
                        if (newValue && track){
                            newValues = newValue.split(",");
                            track.radius = newValues[2];
                            track.thickness = newValues[3];
                            track.draw();
                        }
                    }
                );
            }]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A marker is an arc that can be used to designate a special area on a track
------------------------------------------------------------------------------------*/
app.directive("marker", ['PlasmidLib',
    function(PlasmidLib) {
        return {
            restrict: 'AE',
            scope: {
                start: "=",
                end: "=",
                offsetradius: "=",
                offsetthickness: "=",
                markerclick: "&"
            },
            require: ['marker', '^track'],
            link: {
                pre : function(scope, elem, attrs, controllers) {
                    var markerController = controllers[0],trackController = controllers[1];
                    markerController.init(trackController);
                },
                post :  function(scope, elem, attrs, controllers) {
                    var markerController = controllers[0];
                    var svg = markerController.marker.svg;
                    svg.append(elem[0].childNodes);
                    elem.replaceWith(svg);
                    /*
                    marker.svg.on("click", function(e) {
                        var marker = scope;
                        scope.markerclick({
                            $e: e,
                            $marker: marker
                        });
                    });
                    */
                }
            },
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var marker;
                this.init = function(trackController) {
                    marker = trackController.track.addMarker($element,$attrs);
                };
                Object.defineProperty(this,"marker",{
                    get: function() {return marker;},
                });

                $scope.$watch(
                    function() {
                        var track = marker.track;
                        var plasmid = track.plasmid;
                        return [plasmid.sequencelength, track.center.x, track.center.y, track.radius, track.thickness, $scope.offsetradius, $scope.offsetthickness, $scope.start, $scope.end ].join();
                    },
                    function(newValue) {
                        if (newValue && marker){
                            newValues = newValue.split(",");
                            marker.offsetradius = newValues[5];
                            marker.offsetthickness = newValues[6];
                            marker.start = newValues[7];
                            marker.end = newValues[8];
                            marker.draw();
                        }
                    }
                );
                
            }]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A marker is an arc that can be used to designate a special area on a track
------------------------------------------------------------------------------------*/
app.directive("markerlabel", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                offsetradius : "=",
                offsetangle : "="
            },
            require: ['markerlabel', '^marker'],
            link: function(scope, elem, attrs, controllers) {
                var text = angular.element(SVGUtil.createSVGNode('text', attrs));
                text.append(elem[0].childNodes);
                elem.replaceWith(text);
                controllers[0].init(text, controllers[1]);

            },
            controller: ['$scope',
                function($scope) {
                    var controller = this,
                        element;
                    this.init = function(elem, marker) {
                        element = elem;
                        $scope.marker = marker;
                    };

                    $scope.$watch(function() {
                        var pos = $scope.marker.getDimensions().position();
                        var watchArr = [pos.x, pos.y];
                        return watchArr.join();
                    }, function(newValue) {
                        var pos = $scope.marker.getDimensions().position($scope.offsetradius,$scope.offsetangle);
                        element.attr("x", pos.x);
                        element.attr("y", pos.y);
                    });
                }
            ]
        };
    }
]);

/*
    Properties:
        interval        :  [integer] Uses the parent plasmid's 'length' property along with this interval to determine how many tick marks to make
        ticklength      :  [integer] - Length of the tick marks
        tickoffset      :  [integer] - Any adjustment to the placement of the tick marks with respect to the track
        direction       :  ["in"|"out"] - Direction and which side of a track the tick marks at attached to
*/
app.directive("scale", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                interval: "=",
                ticklength: "=",
                tickoffset: "="
            },
            require: ['scale', '^track', '^plasmid'],
            link: function(scope, elem, attrs, controllers) {
                var path = angular.element(SVGUtil.createSVGNode('path', attrs));
                path.append(elem[0].childNodes);
                elem.replaceWith(path);
                controllers[0].init(path, controllers[1], controllers[2]);
            },
            controller: ['$scope', '$attrs',
                function($scope, $attrs) {
                    var controller = this,
                        element;
                    this.init = function(elem, track, plasmid) {
                        element = elem;
                        $scope.track = track;
                        $scope.plasmid = plasmid;
                    };
                    this.getPath = function() {
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var inwardTickFlg = $attrs.direction == 'in';
                        var radius = inwardTickFlg ? t.radius : t.radius + t.thickness;
                        var tickoffset = (inwardTickFlg ? -1 : 1) * Number($scope.tickoffset || 0);
                        var ticklength = (inwardTickFlg ? -1 : 1) * Number($scope.ticklength || 3);
                        var interval = Number($scope.interval);
                        return SVGUtil.getPath.scale(t.center.x, t.center.y, radius + tickoffset, interval, p.length, ticklength);
                    };
                    $scope.$watch(function() {
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var watchArr = [t.center.x, t.center.y, t.radius, t.thickness, p.length, $scope.tickoffset, $scope.ticklength, $scope.interval];
                        return watchArr.join();
                    }, function(newValue) {
                        element.attr("d", controller.getPath());
                    });
                }
            ]
        };
    }
]);
/*
    Properties:
        interval        :  [integer] Uses the parent plasmid's 'length' property along with this interval to determine how many labels to make
        labeloffset     :  [integer] Label offset distance from the track.  Inward/Outward offset is determined by the direction
        direction       :  ["in" | "out"] Side of the track the lables are attached to
*/
app.directive("scalelabel", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                interval: "=",
                labeloffset: "="
            },
            require: ['scalelabel', '^track', '^plasmid'],
            link: function(scope, elem, attrs, controllers) {
                var g = angular.element(SVGUtil.createSVGNode('g', attrs));
                elem.replaceWith(g);
                controllers[0].init(g, controllers[1], controllers[2]);
            },
            controller: ['$scope', '$attrs',
                function($scope, $attrs) {
                    var controller = this,
                        element;
                    this.init = function(elem, track, plasmid) {
                        element = elem;
                        $scope.track = track;
                        $scope.plasmid = plasmid;
                    };
                    this.getElements = function() {
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var inwardLabelFlg = $attrs.direction == 'in';
                        var labeloffset = (Number($scope.labeloffset || 15)) * (inwardLabelFlg ? -1 : 1);
                        var radius = t.radius + labeloffset + (inwardLabelFlg ? 0 : t.thickness);
                        var interval = Number($scope.interval);
                        return SVGUtil.getElements.label(t.center.x, t.center.y, radius, interval, p.length);
                    };
                    $scope.$watch(function() {
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var watchArr = [t.center.x, t.center.y, t.radius, t.thickness, p.length, $scope.labeloffset, $scope.interval];
                        return watchArr.join();
                    }, function() {
                        var labelArr = controller.getElements();
                        element.empty();
                        for (i = 0; i <= labelArr.length - 1; i++) {
                            var t = angular.element(SVGUtil.createSVGNode('text', $attrs));
                            t.attr("x", labelArr[i].x);
                            t.attr("y", labelArr[i].y);
                            t.text(labelArr[i].text);
                            element.append(t);
                        }
                    });
                }
            ]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A marker is an arc that can be used to designate a special area on a track
------------------------------------------------------------------------------------*/
app.directive("tracklabel", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {},
            require: ['tracklabel', '^track'],
            link: function(scope, elem, attrs, controllers) {
                var text = angular.element(SVGUtil.createSVGNode('text', attrs));
                text.append(elem[0].childNodes);
                elem.replaceWith(text);
                controllers[0].init(text, controllers[1]);

            },
            controller: ['$scope',
                function($scope) {
                    var controller = this,
                        element;
                    this.init = function(elem, track) {
                        element = elem;
                        $scope.track = track;
                    };

                    $scope.$watch(function() {
                        var center = $scope.track.getDimensions().center;
                        var watchArr = [center.x, center.y];
                        return watchArr.join();
                    }, function(newValue) {
                        var pos = $scope.track.getDimensions().center;
                        element.attr("x", pos.x);
                        element.attr("y", pos.y);
                    });
                }
            ]
        };
    }
]);
