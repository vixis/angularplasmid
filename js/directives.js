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
                        scope.ngModel -= 5;
                    });
                } else if (e.which == 40) {
                    scope.$apply(function() {
                        scope.ngModel += 5;
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
                length: '=',
                height: '=',
                width: '='
            },
            compile: function(elem, attrs) {
                var svg = SVGUtil.createSVGNode('svg', attrs);
                angular.element(svg).append(elem[0].childNodes);
                elem.replaceWith(svg);
                return {
                    pre: function(scope, elem, attrs, ctrl) {
                        ctrl.init(elem);
                    },
                };
            },
            controller: function($scope) {
                var element, ctrl = this;
                this.init = function(elem) {
                    element = elem;
                };
                this.getDimensions = function() {
                    return {
                        size: {
                            width: $scope.width,
                            height: $scope.height,
                        },
                        center: {
                            x: $scope.width / 2,
                            y: $scope.height / 2
                        },
                        length: $scope.length
                    };
                };
                $scope.$watch("height", function(newVal) {
                    if (newVal) {
                        element.attr("height", newVal);
                    }
                });
                $scope.$watch("width", function(newVal) {
                    if (newVal) {
                        element.attr("width", newVal);
                    }
                });
            }
        };
    }
]);
app.directive("track", ['SVGUtil',
    function(SVGUtil) {
        return {
            restrict: 'A',
            require: "^plasmid",
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
                    post: function(scope, elem, attr, parentCtrl) {
                        var e = angular.element(elem[0].childNodes[0]);
                        var d = parentCtrl.getDimensions();
                        e.css("fill-rule", "evenodd");
                        scope.$watchCollection('[radius,thickness]', function(newValues) {
                            if (newValues) {
                                e.attr("d", SVGUtil.getPath.donut(d.center.x, d.center.y, newValues[0], newValues[1]));
                            }
                        });
                    }
                };
            },
            controller: function($scope) {
                this.getDimensions = function() {
                    return {
                        radius: Number($scope.radius),
                        thickness: Number($scope.thickness)
                    };
                };
            }
        };
    }
]);
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
            require: ['^track', '^plasmid'],
            link: function(scope, elem, attrs, ctrlArr) {
                var path = angular.element(SVGUtil.createSVGNode('path', attrs));
                var plasmid = ctrlArr[1].getDimensions();
                var track = ctrlArr[0].getDimensions();
                path.append(elem[0].childNodes);
                elem.replaceWith(path);
                path.on("click", function(e){
                    var marker = scope;
                    scope.markerclick({$e:e, $marker: marker});
                });
                scope.$watch(function() {
                    return (ctrlArr[0].getDimensions().radius + Number(scope.offsetradius || 0)) + "," + (ctrlArr[0].getDimensions().thickness + Number(scope.offsetthickness || 0)) + "," + (Number(scope.start)/Number(ctrlArr[1].getDimensions().length)*360) + "," + (Number(scope.end)/Number(ctrlArr[1].getDimensions().length)*360);
                }, function(newValue) {
                    if (newValue) {
                        var newValues = newValue.split(",");
                        path.attr("d", SVGUtil.getPath.arc(plasmid.center.x, plasmid.center.y, Number(newValues[0]), Number(newValues[2]), Number(newValues[3]), Number(newValues[1]), attrs.arrowstart, attrs.arrowend));
                    }
                });
            }
        };
    }
]);
app.directive("scale", ['SVGUtil',
/*
	Properties:
		interval		:  [integer] Uses the parent plasmid's 'length' property along with this interval to determine how many tick marks to make
		ticklength		:  [integer] - Length of the tick marks
		tickdirection	:  ["in"|"out"] - Direction and which side of a track the tick marks at attached to
		tickoffset	 	:  [integer] - Any adjustment to the placement of the tick marks with respect to the track
*/
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                interval: "=",
                ticklength: "=",
                tickoffset: "="
            },
            require: ['^track', '^plasmid'],
            link: function(scope, elem, attrs, ctrlArr) {
                var path = angular.element(SVGUtil.createSVGNode('path', attrs));
                var plasmid = ctrlArr[1].getDimensions();
                var track = ctrlArr[0].getDimensions();
                path.append(elem[0].childNodes);
                elem.replaceWith(path);
                scope.$watch(
                function() {
                    return (ctrlArr[0].getDimensions().radius + Number(scope.tickoffset || 0)) + "," + ctrlArr[0].getDimensions().thickness + "," + (Number(scope.interval || 0)) + "," + (Number(scope.ticklength || 3));
                },
                function(newValue) {
                    if (newValue) {
                        var newValues = newValue.split(",");
                        var ticklength, radius;
                        if (attrs.tickdirection == 'in') {
                            ticklength = -newValues[3];
                            radius = newValues[0];
                        } else {
                            ticklength = newValues[3];
                            radius = Number(newValues[0]) + Number(newValues[1]);
                        }
                        path.attr("d", SVGUtil.getPath.scale(plasmid.center.x, plasmid.center.y, radius, newValues[2], plasmid.length, ticklength));
                    }
                });
            }
        };
    }
]);

app.directive("scalelabel", ['SVGUtil',
/*
    Properties:
        interval        :  [integer] Uses the parent plasmid's 'length' property along with this interval to determine how many labels to make
        labeloffset     :  [integer] Label offset distance from the track.  Inward/Outward offset is determined by the labeldirection
        labeldirection  :  ["in" | "out"] Side of the track the lables are attached to
*/
    function(SVGUtil) {
        return {
            restrict: 'A',
            scope: {
                interval: "=",
                labeloffset: "="
            },
            require: ['^track', '^plasmid'],
            link: function(scope, elem, attrs, ctrlArr) {

                // Create group element that will hold all text labels
                var g = angular.element(SVGUtil.createSVGNode('g', attrs));
                elem.replaceWith(g);

                // Get references to attached plasmid and track controllers
                var plasmid = ctrlArr[1].getDimensions();
                var track = ctrlArr[0].getDimensions();

                // Determine some defaults
                var labelinward = (attrs.labeldirection) ? ((attrs.labeldirection=='in') ? -1 : 1) : 1;
                var defaultoffset = 15;

                // Watch for changes in this directive and its parent directives and redraw if necessary
                scope.$watch(
                    function() {
                        return  (ctrlArr[0].getDimensions().radius + (labelinward * Number(scope.labeloffset===undefined ? defaultoffset : scope.labeloffset))) + "," +
                                (ctrlArr[0].getDimensions().thickness) + "," +
                                (Number(scope.interval || 0));
                    },
                    function(newValue) {
                        if (newValue) {

                            var newValues = newValue.split(",");
                            var radius = Number(newValues[0]) + ((labelinward==1) ? Number(newValues[1]) : 0 );
                            var labelArr = SVGUtil.getElements.label(plasmid.center.x, plasmid.center.y, radius, newValues[2], plasmid.length);
                            g.empty();
                            for(i=0;i<=labelArr.length-1;i++){
                                var t = angular.element(SVGUtil.createSVGNode('text',attrs));
                                t.attr("x", labelArr[i].x);
                                t.attr("y", labelArr[i].y);
                                t.text(labelArr[i].text);
                                g.append(t);
                            }
                        }
                });
            }
        };
    }
]);
