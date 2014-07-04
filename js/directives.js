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
                        scope.ngModel = Number(scope.ngModel) - 6;
                    });
                } else if (e.which == 40) {
                    scope.$apply(function() {
                        scope.ngModel = Number(scope.ngModel) + 6;
                    });
                }
            });
        }
    };
});

app.directive("plasmidapi",['SVGUtil', function(SVGUtil){
    return {
        restrict: "AE",
        link : function(scope, elem, attr){
            scope[attr.name] = SVGUtil.api;
        }
    };
}]);

app.directive("plasmid", ['SVGUtil', function(SVGUtil){
    return {
        restrict: 'AE',
        type : 'svg',
        template : '<svg></svg>',
        replace : true,
        transclude:true,
        require: 'plasmid',
        scope: {
            plasmidheight : '=',
            plasmidwidth : '=',
            sequencelength : '=',
            sequence : '='
        },
        link : {
            pre : function(scope,elem,attr,plasmidController){
                plasmidController.init(elem);
            },
            post : function(scope,elem,attrs,plasmidController,transcludeFn){

                // Manually transclude children elements
                transcludeFn(scope.$parent, function(content){
                    elem.append(content);
                });

                // Watch for changes to plasmid
                scope.$watchGroup(['plasmidheight','plasmidwidth','sequencelength','sequence'],function(){plasmidController.draw();});
            }
        },
        controller : ['$scope', 'SVGUtil', function($scope, SVGUtil){
            var element, trackControllers = [];

            this.init = function(elem){
                SVGUtil.api.addPlasmid(this);
                element = elem;
            };

            this.draw = function(){
                element.attr("height",$scope.plasmidheight);
                element.attr("width", $scope.plasmidwidth);
                angular.forEach(trackControllers, function(t){
                    t.draw();
                });
            };

            this.addTrack = function(trackController){
                trackControllers.push(trackController);
            };

            Object.defineProperty($scope,"center",{
                get: function() {
                    return {
                        x : Number($scope.plasmidheight)/2,
                        y : Number($scope.plasmidwidth)/2
                    };
                }
            });
    
            this.tracks = trackControllers;
            this.plasmid = $scope;
        }]
    };
}]);

app.directive("plasmidtrack", ['SVGUtil', function(SVGUtil){
    return {
        restrict: 'AE',
        type : 'svg',
        template: '<g><path></path></g>',
        replace : true,
        transclude: true,
        require: ['plasmidtrack', '^plasmid'],
        scope: {
            radius: '=',
            thickness: '='
        },
        link : {
            pre : function(scope,elem,attr,controllers,transcludeFn){
                var trackController = controllers[0], plasmidController = controllers[1];
                trackController.init(angular.element(elem.children()[0]), plasmidController);
            },
            post : function(scope,elem,attr,controllers,transcludeFn){

                // Manually transclude children elements
                transcludeFn(scope.$parent, function(content){
                    elem.append(content);
                });

                // Apply special style to path to allow for correct display and apply directive's properties (class, style, id, name) to the path instead of the g
                var g = angular.element(elem), path  = angular.element(elem.children()[0]);
                SVGUtil.util.swapProperties(g, path);
                path.css("fill-rule", "evenodd");

                // Watch for changes in the track
                var trackController = controllers[0];
                scope.$watchGroup(['radius','thickness'],function(){trackController.draw();});
            }
        },
        controller : ['$scope', function($scope){
            var plasmidController, element, markerControllers = [], scaleControllers = [];

            this.init = function(elem, plasmidCtrl){
                plasmidCtrl.addTrack(this);
                plasmidController = plasmidCtrl;
                this.plasmid = plasmidController.plasmid;
                element = elem;
            };

            this.draw = function(){
                var center = $scope.center;
                var path = SVGUtil.svg.path.donut(center.x, center.y, $scope.radius, $scope.thickness);
                element.attr("d", path);
                angular.forEach(markerControllers, function(m){
                    m.draw();
                });
                angular.forEach(scaleControllers, function(s){
                    s.draw();
                });
            };

            this.addMarker = function(markerController){
                markerControllers.push(markerController);
            };
   
            this.addScale = function(scaleController){
                scaleControllers.push(scaleController);
            };

            this.markergroup = function(groupName){
                var items = [];
                angular.forEach(markerControllers, function(item){
                    if (item.marker.markergroup==groupName){
                        items.push(item);
                    }
                });
                return items;
            };

            $scope.getPosition = function(pos, positionOption, radiusAdjust){
                radiusAdjust = Number(radiusAdjust || 0); pos = Number(pos);

                var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2;
                var seqLen = plasmidController.plasmid.sequencelength;

                if (seqLen>0) {
                    var radius, angle = (pos/seqLen)*360;
                    switch (positionOption){
                        case POSITION_OPTION_INNER : radius = $scope.radius + radiusAdjust; break;
                        case POSITION_OPTION_OUTER : radius = $scope.radius + $scope.thickness + radiusAdjust; break;
                        default : radius = $scope.radius + ($scope.thickness/2) + radiusAdjust; break;
                    }
                    var center = $scope.center;
                    return  SVGUtil.util.polarToCartesian(center.x, center.y , radius, angle);
                }
            };
            Object.defineProperty($scope,"center",{
                get: function() {
                    return plasmidController.plasmid.center;
                }
            });

            this.markers = markerControllers;
            this.track = $scope;
        }]
    };
}]);
app.directive("trackscale", ['SVGUtil', function(SVGUtil){
    return {
        restrict: 'AE',
        type : 'svg',
        template: '<g><path></path><g></g></g>',
        replace : true,
        transclude: true,
        require: ['trackscale', '^plasmidtrack'],
        scope: {
            interval: "=",
            offset: "=",
            ticklength: "=",
            direction: "@",
            showlabels : "@",
            labeloffset : "=",
            labelclass : "@",
            labelstyle : "@"
        },
        link : {
            pre : function(scope,elem,attr,controllers,transcludeFn){
                var scaleController = controllers[0], trackController = controllers[1];
                scaleController.init(angular.element(elem.children()[0]), angular.element(elem.children()[1]), trackController);
            },
            post : function(scope,elem,attr,controllers,transcludeFn){

                //Manually transclude children elements
                transcludeFn(scope.$parent, function(content){
                    elem.append(content);
                });

                //Apply directive's properties (class, style, id, name) to the path instead of the g
                var g = angular.element(elem), path  = angular.element(elem.children()[0]);
                SVGUtil.util.swapProperties(g, path);

                // Watch for changes to scale
                var scaleController = controllers[0];
                scope.$watchGroup(['interval','offset','ticklength','labeloffset'],function(){scaleController.draw();});


            }
        },
        controller : ['$scope', function($scope){
            var trackController, element, groupElement;
            var DEFAULT_LABELOFFSET = 15, DEFAULT_TICKLENGTH = 2;

            this.init = function(elem, groupElem, trackCtrl){
                trackCtrl.addScale(this);
                trackController = trackCtrl;
                element = elem;
                groupElement = groupElem;
            };

            this.draw = function(){
                var center = trackController.track.center;
                var path = SVGUtil.svg.path.scale(center.x, center.y, $scope.radius, $scope.interval, $scope.total, ($scope.ticklength || DEFAULT_TICKLENGTH));
                element.attr("d", path);
                if ($scope.showlabels){
                    this.drawLabel();
                }
            };

            this.drawLabel = function(){
                var center = trackController.track.center;
                var labels = SVGUtil.svg.element.scalelabels(center.x, center.y, $scope.labelradius, $scope.interval, $scope.total);
                groupElement.empty();
                for (i = 0; i <= labels.length - 1; i++) {
                    var t = angular.element(SVGUtil.svg.createNode('text'));
                    if ($scope.labelclass) { t.addClass($scope.labelclass);}
                    if ($scope.labelstyle) { t.attr('style',$scope.labelstyle);}
                    t.attr("x", labels[i].x);
                    t.attr("y", labels[i].y);
                    t.text(labels[i].text);
                    groupElement.append(t);
                }
            };

            Object.defineProperty($scope,"labelradius",{
                get: function() {
                    return Number($scope.radius) + Number(($scope.labeloffset || DEFAULT_LABELOFFSET) * ($scope.directionflg ? -1 : 1));
                }
            });
            Object.defineProperty($scope,"radius",{
                get: function() {
                    return ($scope.directionflg ? trackController.track.radius : trackController.track.radius + trackController.track.thickness) +  ($scope.directionflg ? -1 : 1) * Number($scope.offset || 0) + ($scope.directionflg ? -($scope.ticklength || DEFAULT_TICKLENGTH) : 0);
                }
            });
            Object.defineProperty($scope,"directionflg",{
                get: function() {
                    return $scope.direction=='in';
                }
            });
            Object.defineProperty($scope,"total",{
                get: function() {
                    return trackController.plasmid.sequencelength;
                }
            });
            this.scale = $scope;
        }]
    };
}]);

app.directive("trackmarker", ['SVGUtil', function(SVGUtil){
    return {
        restrict: 'AE',
        type : 'svg',
        template: '<g><path></path></g>',
        replace : true,
        transclude: true,
        require: ['trackmarker', '^plasmidtrack'],
        scope: {
            start: "=",
            end: "=",
            offsetradius: "=",
            offsetthickness: "=",
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
            pre : function(scope,elem,attr,controllers,transcludeFn){
                var markerController = controllers[0], trackController = controllers[1];
                markerController.init(angular.element(elem.children()[0]), trackController);
            },
            post : function(scope,elem,attr,controllers,transcludeFn){

                var markerController = controllers[0];

                //Manually transclude children elements
                transcludeFn(scope.$parent, function(content){
                    elem.append(content);
                });

                //Apply directive's properties (class, style, id, name) to the path instead of the g
                var g = angular.element(elem), path  = angular.element(elem.children()[0]);
                SVGUtil.util.swapProperties(g, path);

                //Attach event handlers
                path.on("click", function(e) {
                    scope.markerclick({
                        $e: e,
                        $marker: markerController.marker
                    });
                });

                // Watch for changes to marker
                scope.$watchGroup(['start','end','offsetradius','offsetthickness'],function(){markerController.draw();});

            }
        },
        controller : ['$scope', function($scope){
            var trackController, element, markerlabelControllers = [];

            this.init = function(elem, trackCtrl){
                trackCtrl.addMarker(this);
                trackController = trackCtrl;
                element = elem;
            };

            this.draw = function(){
                element.attr("d", $scope.getPath());
                angular.forEach(markerlabelControllers, function(ml){
                    ml.draw();
                });
            };

            this.addMarkerLabel = function(markerlabelController){
                markerlabelControllers.push(markerlabelController);
            };

            $scope.getPath = function(){
                var center = trackController.track.center;
                return SVGUtil.svg.path.arc(center.x, center.y, $scope.radius, $scope.startangle, $scope.endangle, $scope.thickness, $scope.arrowstart, $scope.arrowend);
            };
            $scope.getPosition = function(hAdjust, vAdjust){
                hAdjust = Number(hAdjust || 0); vAdjust = Number(vAdjust || 0);

                var radius = {
                    outer :  $scope.radius + $scope.thickness + vAdjust,
                    inner : $scope.radius + vAdjust,
                    center : $scope.radius + ($scope.thickness/2) + vAdjust
                };

                var angle = {
                    begin : $scope.startangle + hAdjust,
                    end : $scope.endangle + hAdjust,
                    middle : $scope.midangle + hAdjust,
                };

                var center = trackController.track.center;

                return {
                    outer : {
                        begin: SVGUtil.util.polarToCartesian(center.x, center.y , radius.outer, angle.begin),
                        middle: SVGUtil.util.polarToCartesian(center.x, center.y , radius.outer, angle.middle),
                        end: SVGUtil.util.polarToCartesian(center.x, center.y , radius.outer, angle.end),
                    },
                    center : {
                        begin: SVGUtil.util.polarToCartesian(center.x, center.y , radius.center, angle.begin),
                        middle: SVGUtil.util.polarToCartesian(center.x, center.y , radius.center, angle.middle),
                        end: SVGUtil.util.polarToCartesian(center.x, center.y , radius.center, angle.end),
                    },
                    inner : {
                        begin: SVGUtil.util.polarToCartesian(center.x, center.y , radius.inner, angle.begin),
                        middle: SVGUtil.util.polarToCartesian(center.x, center.y , radius.inner, angle.middle),
                        end: SVGUtil.util.polarToCartesian(center.x, center.y , radius.inner, angle.end),
                    }
                };

            };
            Object.defineProperty($scope,"radius",{
                get: function() {
                    return trackController.track.radius + Number($scope.offsetradius || 0);
                },
            });
            Object.defineProperty($scope,"thickness",{
                get: function() {
                    return trackController.track.thickness + Number($scope.offsetthickness || 0);
                },
            });
            Object.defineProperty($scope,"startangle",{
                get: function() {
                    return (Number($scope.start||0)/Number(trackController.plasmid.sequencelength))*360;
                },
            });
            Object.defineProperty($scope,"endangle",{
                get: function() {
                    var endAngle = (Number($scope.end||$scope.start)/Number(trackController.plasmid.sequencelength))*360;
                    endAngle += (endAngle<$scope.startangle) ? 360 : 0;
                    return endAngle;
                },
            });
            Object.defineProperty($scope,"midangle",{
                get: function() {
                    return $scope.startangle + ($scope.endangle-$scope.startangle)/2;
                },
            });
            Object.defineProperty($scope,"arrowstart",{
                get: function() {
                    return {
                        width : Number($scope.arrowstartwidth || 0),
                        length : Number($scope.arrowstartlength || 0),
                        angle : Number($scope.arrowstartangle || 0)
                    };
                }
            });
            Object.defineProperty($scope,"arrowend",{
                get: function() {
                    return {
                        width : Number($scope.arrowendwidth || 0),
                        length : Number($scope.arrowendlength || 0),
                        angle : Number($scope.arrowendangle || 0)
                    };
                }
            });

            this.marker = $scope;
        }]
    };
}]);
app.directive("markerlabel", ['SVGUtil', function(SVGUtil){
    return {
        restrict: 'AE',
        type : 'svg',
        transclude: true,
        template: "<text>{{text}}</text>",
        require: ['markerlabel', '^trackmarker'],
        replace : true,
        scope: {
            text : "@",
            vadjust : "@",
            hadjust : "@",
        },
        link: {
            pre : function(scope,elem,attr,controllers,transcludeFn){
                var markerlabelController = controllers[0], trackMarkerController = controllers[1];
                markerlabelController.init(elem, trackMarkerController);
            },
            post : function(scope,elem,attr,controllers,transcludeFn){
                transcludeFn(scope.$parent, function(content){
                    elem.append(content);
                });

            }
        },
        controller : ['$scope', function($scope){
            var markerController, element;

            this.init = function(elem, markerCtrl){
                markerCtrl.addMarkerLabel(this);
                markerController = markerCtrl;
                element = elem;
            };

            this.draw = function(){
                var center = markerController.marker.getPosition($scope.hadjust,$scope.vadjust).center.middle;
                element.attr("x", center.x);
                element.attr("y", center.y);
            };

            this.markerlabel = $scope;
        }]
    };
}]);

