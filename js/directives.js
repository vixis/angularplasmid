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
app.directive("plasmid", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: "A",
            scope: {
                sequence: '=',
                length: '=',
                height: '=',
                width: '='
            },
            compile: function(elem, attrs) {
                var svg = SVGUtil.createSVGNode('svg', attrs, ['height', 'width']);
                angular.element(svg).append(elem[0].childNodes);
                elem.replaceWith(svg);
                return {
                    pre: function(scope, elem, attrs, ctrl) {
                        ctrl.init(elem);
                    },
                };
            },
            controller: ['$rootScope', '$scope', '$attrs',
                function($rootScope, $scope, $attrs) {
                    var element, tracks = [];
                    
                    $rootScope.plasmids = $rootScope.plasmids || [];
                    $rootScope.plasmids.push(this);

                    this.attrs = $attrs;

                    this.init = function(elem) {
                        element = elem;
                    };
                    this.getDimensions = function() {
                        return {
                            height: Number($scope.height),
                            width: Number($scope.width),
                            center: {
                                x: Number($scope.height) / 2,
                                y: Number($scope.width) / 2
                            }
                        };
                    };
                    this.getSequence = function() {
                        return {
                            length: Number($scope.length)
                        };
                    };
                    this.addTrack = function(track){
                        tracks.push(track);
                    };
                    this.tracks = tracks;


                    $scope.$watchCollection('[height, width]', function(newValues) {
                        if (newValues) {
                            var height = Number(newValues[0]),
                                width = Number(newValues[1]);
                            // Change the size of the SVG to reflect the updated values
                            element.attr("height", height);
                            element.attr("width", width);
                        }
                    });
                }
            ]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A track consists of two SVG elements: 
    (1) SVG Group (will be appended to by the track's children)
    (2) the actual track itself. 
------------------------------------------------------------------------------------*/
app.directive("track", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            require: ["track", "^plasmid"],
            scope: {
                radius: '=',
                thickness: '='
            },
            compile: function(elem, attrs) {
                var g = SVGUtil.createSVGNode('g');
                var path = SVGUtil.createSVGNode('path', attrs);
                angular.element(g).append(path);
                angular.element(g).append(elem[0].childNodes);
                elem.replaceWith(g);
                return {
                    post: function(scope, elem, attr, controllers) {
                        controllers[0].init(angular.element(elem[0].childNodes[0]), controllers[1]);
                    }
                };
            },
            controller: ['$scope',
                function($scope) {
                    var controller = this,
                        element, markers=[];
                    this.init = function(elem, plasmid) {
                        elem.css("fill-rule", "evenodd");
                        element = elem;
                        plasmid.addTrack(controller);
                        $scope.plasmid = plasmid;
                    };
                    this.getDimensions = function() {
                        var p = $scope.plasmid.getDimensions();
                        return {
                            radius: Number($scope.radius),
                            thickness: Number($scope.thickness),
                            center: {
                                x: p.center.x,
                                y: p.center.y
                            }
                        };
                    };
                    this.getPath = function() {
                        var t = controller.getDimensions();
                        return SVGUtil.getPath.donut(t.center.x, t.center.y, t.radius, t.thickness);
                    };

                    this.addMarker = function(marker){
                        markers.push(marker);
                    };
                    this.markers = markers;
                    $scope.$watch(function() {
                        var t = controller.getDimensions();
                        var watchArr = [t.center.x, t.center.y, t.radius, t.thickness];
                        return watchArr.join();
                    }, function() {
                        element.attr("d", controller.getPath());
                    });
                }
            ]
        };
    }
]);
/*----------------------------------------------------------------------------------- 
    A marker is an arc that can be used to designate a special area on a track
------------------------------------------------------------------------------------*/
app.directive("marker", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                start: "=",
                end: "=",
                offsetradius: "=",
                offsetthickness: "=",
                markerclick: "&"
            },
            require: ['marker', '^track', '^plasmid'],
            link: function(scope, elem, attrs, controllers) {
                var g = angular.element(SVGUtil.createSVGNode('g'));
                var path = angular.element(SVGUtil.createSVGNode('path', attrs));
                g.append(path);
                g.append(elem[0].childNodes);
                elem.replaceWith(g);
                controllers[0].init(path, controllers[1], controllers[2]);
                path.on("click", function(e) {
                    var marker = scope;
                    scope.markerclick({
                        $e: e,
                        $marker: marker
                    });
                });
            },
            controller: ['$scope', '$attrs',
                function($scope, $attrs) {
                    var controller = this,
                        element;
                    this.init = function(elem, track, plasmid) {
                        element = elem;
                        track.addMarker(controller);
                        $scope.track = track;
                        $scope.plasmid = plasmid;
                    };
                    this.getPath = function() {
                        var d = controller.getDimensions();
                        arrowStart = $attrs.arrowstart;
                        arrowEnd = $attrs.arrowend;
                        return SVGUtil.getPath.arc(d.track.center.x, d.track.center.y, d.radius, d.angle.start, d.angle.end, d.thickness, d.arrow.start, d.arrow.end);
                    };
                    this.getDimensions = function(){
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var radius = t.radius + Number($scope.offsetradius || 0);
                        var thickness = t.thickness + Number($scope.offsetthickness || 0);
                        var startAngle = Number($scope.start)/p.length * 360;
                        var endAngle  = Number($scope.end || $scope.start)/p.length * 360;
                        endAngle += (endAngle<startAngle) ? 360 : 0;

                        return {
                            radius : radius,
                            thickness : thickness,
                            arrow : {
                                start : {
                                    width : Number($attrs.arrowstartwidth || 0),
                                    length : Number($attrs.arrowstartlength || 0),
                                    angle : Number($attrs.arrowstartangle || 0)
                                },
                                end : {
                                    width : Number($attrs.arrowendwidth || 0),
                                    length : Number($attrs.arrowendlength || 0),
                                    angle : Number($attrs.arrowendangle || 0)
                                }
                            },
                            angle: {
                                start : startAngle,
                                end : endAngle,
                                calculate : function(position){
                                    return (position/p.length) * 360;
                                }
                            },
                            track : {
                                center : {
                                    x : t.center.x,
                                    y : t.center.y
                                }
                            },
                            position : function(offsetradius, offsetangle){
                                offsetradius = Number(offsetradius || 0);
                                offsetangle = Number(offsetangle || 0);
                                return SVGUtil.polarToCartesian(t.center.x, t.center.y, radius + (thickness/2) + offsetradius, startAngle + ((endAngle-startAngle)/2) + offsetangle);
                            }
                        };
                    };

                    $scope.$watch(function() {
                        var t = $scope.track.getDimensions();
                        var p = $scope.plasmid.getSequence();
                        var watchArr = [t.radius, t.thickness, t.center.x, t.center.y, $scope.offsetradius, $scope.offsetthickness, $scope.start, $scope.end, p.length];
                        return watchArr.join();
                    }, function(newValue) {
                        element.attr("d", controller.getPath());
                    });
                }
            ]
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
