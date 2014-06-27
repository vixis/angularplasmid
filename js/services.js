app.factory("PlasmidLib", ["SVGUtil", function(SVGUtil){

    var plasmidArr = {}, trackArr = {}, markerArr = {};

    function Plasmid(element,attrs){
         var _height, _width, _sequence, _sequencelength, _tracks = {};

        var id = attrs.id;
        if (id){
            plasmidArr[id] = this;
        }

        var svg = angular.element(SVGUtil.svg.createNode('svg', attrs, ['height', 'width']));
        this.svg = svg;
        this.attrs = attrs;

        Object.defineProperty(this,"height",{
            get: function() {return _height;},
            set: function(value) {
                _height = Number(value);
                svg.attr('height',value);
            }
        });

        Object.defineProperty(this,"width",{
            get: function() {return _width;},
            set: function(value) {
                _width = Number(value);
                svg.attr('width',value);
            }
        });

        Object.defineProperty(this,"center",{
            get: function() {
                return {
                    x : _width/2,
                    y : _height/2
                };
            },
        });

        Object.defineProperty(this,"sequence",{
            get: function() {return _sequence;},
            set: function(value) {
                _sequence = value;
            }
        });

        Object.defineProperty(this,"sequencelength",{
            get: function() {
                return Number((_sequence) ? _sequence.length : _sequencelength);
            },
            set: function(value) {
                _sequencelength = Number(value);
            }
        });

        this.addTrack = function(element, attrs){
            var track = new Track(this, element,attrs);
            var id = attrs.id;
            if (id){
                _tracks[id] = track;
                trackArr[id] = track;
            }
            return track;
        };

        Object.defineProperty(this,"tracks",{
            get: function() {return _tracks;}
        });

    }

    function Track(plasmid, element, attrs){
        var _radius,  _thickness, _markers = {};
        var track = this;

        var g = angular.element(SVGUtil.svg.createNode('g'));
        var path = angular.element(SVGUtil.svg.createNode('path', attrs));
        path.css("fill-rule", "evenodd");
        g.append(path);
        this.svg = g;
        this.plasmid = plasmid;
        this.attrs = attrs;

        Object.defineProperty(this,"radius",{
            get: function() {return _radius;},
            set: function(value) {
                _radius = Number(value);
            }
        });

        Object.defineProperty(this,"thickness",{
            get: function() {return _thickness;},
            set: function(value) {
                _thickness = Number(value);
            }
        });

        Object.defineProperty(this,"center",{
            get: function() {
                return {
                    x : plasmid.center.x,
                    y : plasmid.center.y
                };
            },
        });

        this.addMarker = function(element, attrs){
            var marker = new Marker(this, element,attrs);
            var id = attrs.id;
            if (id){
                _markers[id] = marker;
                markerArr[id] = marker;
            }
            return marker;
        };

        Object.defineProperty(this,"markers",{
            get: function() {return _markers;}
        });

        this.draw = function(){
            path.attr("d", SVGUtil.svg.path.donut(track.center.x, track.center.y, track.radius, track.thickness));
        };

        this.getPosition = function(pos, positionOption, radiusAdjust){
            var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2;

            radiusAdjust = Number(radiusAdjust || 0);
            pos = Number(pos);

            if (plasmid.sequencelength>0) {
                var radius, angle = (pos/plasmid.sequencelength)*360;
                switch (positionOption){
                    case POSITION_OPTION_INNER : radius = track.radius + radiusAdjust; break;
                    case POSITION_OPTION_OUTER : radius = track.radius + track.thickness + radiusAdjust; break;
                    default : radius = track.radius + (track.thickness/2) + radiusAdjust; break;
                }
                var center =  SVGUtil.util.polarToCartesian(track.center.x, track.center.y , radius, angle);
                return center;
            }
        };
    }

    function Marker(track, element, attrs){

        var _offsetradius,  _offsetthickness, _start, _end;
        var marker = this;

        var g = angular.element(SVGUtil.svg.createNode('g'));
        var path = angular.element(SVGUtil.svg.createNode('path', attrs));
        g.append(path);

        this.svg = g;
        this.track = track;
        this.attrs = attrs;

        Object.defineProperty(this,"offsetradius",{
            get: function() {return _offsetradius;},
            set: function(value) {
                _offsetradius = Number(value);
            }
        });

        Object.defineProperty(this,"radius",{
            get: function() {
                return track.radius + _offsetradius;
            },
        });


        Object.defineProperty(this,"offsetthickness",{
            get: function() {return _offsetthickness;},
            set: function(value) {
                _offsetthickness = Number(value);
            }
        });

        Object.defineProperty(this,"thickness",{
            get: function() {
                return track.thickness + _offsetthickness;
            },
        });

        Object.defineProperty(this,"start",{
            get: function() {return _start;},
            set: function(value) {
                _start = Number(value);
            }
        });

        Object.defineProperty(this,"startangle",{
            get: function() {
                if (track.plasmid.sequencelength){
                    return (_start/track.plasmid.sequencelength)*360;
                }
            },
        });

        Object.defineProperty(this,"end",{
            get: function() {return _end;},
            set: function(value) {
                _end = (value) ? Number(value) : this.start;
            }
        });

        Object.defineProperty(this,"endangle",{
            get: function() {
                if (track.plasmid.sequencelength){
                    var endAngle = (_end/track.plasmid.sequencelength)*360;
                    endAngle += (endAngle<marker.startAngle) ? 360 : 0;
                    return endAngle;
                }
            },
        });

        Object.defineProperty(this,"arrowstart",{
            get: function() {
                return {
                    width : Number(attrs.arrowstartwidth || 0),
                    length : Number(attrs.arrowstartlength || 0),
                    angle : Number(attrs.arrowstartangle || 0)
                };
            }
        });

        Object.defineProperty(this,"arrowend",{
            get: function() {
                return {
                    width : Number(attrs.arrowendwidth || 0),
                    length : Number(attrs.arrowendlength || 0),
                    angle : Number(attrs.arrowendangle || 0)
                };
            }
        });

        this.draw = function(){
            var track = marker.track;
            var p = SVGUtil.svg.path.arc(track.center.x, track.center.y, marker.radius, marker.startangle, marker.endangle, marker.thickness, marker.arrowstart, marker.arrowend);
            path.attr("d", p);
        };


        /*
        position : function(offsetradius, offsetangle){
            offsetradius = Number(offsetradius || 0);
            offsetangle = Number(offsetangle || 0);
            return SVGUtil.polarToCartesian(t.center.x, t.center.y, radius + (thickness/2) + offsetradius, startAngle + ((endAngle-startAngle)/2) + offsetangle);
        }
        
        
        this.getPosition = function(pos, positionOption, radiusAdjust){
            var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2;

            radiusAdjust = Number(radiusAdjust || 0);
            pos = Number(pos);

            if (plasmid.sequencelength>0) {
                var radius, angle = (pos/plasmid.sequencelength)*360;
                switch (positionOption){
                    case POSITION_OPTION_INNER : radius = track.radius + radiusAdjust; break;
                    case POSITION_OPTION_OUTER : radius = track.radius + track.thickness + radiusAdjust; break;
                    default : radius = track.radius + (track.thickness/2) + radiusAdjust; break;
                }
                var center =  SVGUtil.util.polarToCartesian(track.center.x, track.center.y , radius, angle);
                return center;
            }
        };
        */
    }


    return {
        plasmids : plasmidArr,
        tracks : trackArr,
        markers : markerArr,
        Plasmid : Plasmid
    };

}]);

app.factory("SVGUtil", function() {
    /*
        PUBLIC API
        -----------------------------------------------------------------------
        util - General utilities
        svg - SVG node, path calculations
    */
    return {
        util : {
            polarToCartesian : polarToCartesian,
        },
        svg : {
            createNode : createNode,
            path : {
                donut : pathDonut,
                arc : pathArc
            }
        }
    };


    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function createNode(name, settings, excludeSettings) {
        var namespace = 'http://www.w3.org/2000/svg';
        var node = document.createElementNS(namespace, name);
        excludeSettings = excludeSettings || [];
        for (var attribute in settings) {
            if (excludeSettings.indexOf(attribute)<0) {
                var value = settings[attribute];
                if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
                    node.setAttribute(attribute, value);
                }
            }
        }
        return node;
    }

    function pathDonut(x, y, radius, width) {
        x = Number(x); y = Number(y); radius = Number(radius); width = Number(width);

        var innerRing = {
            start : polarToCartesian(x, y, radius, 359.9999),
            end : polarToCartesian(x, y, radius, 0)
        };

        var outerRing = {
            start : polarToCartesian(x, y, radius + width, 359.9999),
            end : polarToCartesian(x, y, radius + width, 0)
        };

        var path = [    "M", innerRing.start.x, innerRing.start.y,
                        "A", radius, radius, 0, 1, 0, innerRing.end.x, innerRing.end.y,
                        "M", outerRing.start.x, outerRing.start.y,
                        "A", radius + width, radius + width, 0, 1, 0, outerRing.end.x, outerRing.end.y
                    ].join(" ");

        return path;
    }

    function pathArc(x, y, radius, startAngle, endAngle, width, arrowStart, arrowEnd) {

        x = Number(x); y = Number(y); radius = Number(radius); startAngle = Number(startAngle); endAngle = Number(endAngle); width = Number(width);
        arrowStart = arrowStart || {width : 0, length : 0, angle: 0};
        arrowEnd = arrowEnd || {width : 0, length : 0, angle: 0};

        endAngle = endAngle - (arrowEnd.length < 0 ? 0 : arrowEnd.length);
        startAngle = startAngle + (arrowStart.length < 0 ? 0 : arrowStart.length);
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var arrow_start_1 = polarToCartesian(x, y, radius - arrowStart.width, startAngle + arrowStart.angle);
        var arrow_start_2 = polarToCartesian(x, y, radius + (width / 2), startAngle - arrowStart.length);
        var arrow_start_3 = polarToCartesian(x, y, radius + width + arrowStart.width, startAngle + arrowStart.angle);
        var arrow_start_4 = polarToCartesian(x, y, radius + width, startAngle);
        var arrow_end_1 = polarToCartesian(x, y, radius + width + arrowEnd.width, endAngle - (arrowEnd.angle / 1));
        var arrow_end_2 = polarToCartesian(x, y, radius + (width / 2), endAngle + arrowEnd.length);
        var arrow_end_3 = polarToCartesian(x, y, radius - arrowEnd.width, endAngle - (arrowEnd.angle / 1));
        var arrow_end_4 = polarToCartesian(x, y, radius, endAngle);
        var start2 = polarToCartesian(x, y, radius + width, endAngle);
        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
        var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y, "L", arrow_start_1.x, arrow_start_1.y, "L", arrow_start_2.x, arrow_start_2.y, "L", arrow_start_3.x, arrow_start_3.y, "L", arrow_start_4.x, arrow_start_4.y, "A", radius + width, radius + width, 0, arcSweep, 1, start2.x, start2.y, "L", arrow_end_1.x, arrow_end_1.y, "L", arrow_end_2.x, arrow_end_2.y, "L", arrow_end_3.x, arrow_end_3.y, "L", arrow_end_4.x, arrow_end_4.y, "z"].join(" ");
        return d;
    }
/*
            scale : function(x, y, radius, interval, total, tickLength){

                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                interval = Number(interval);
                total = Number(total);
                tickLength = Number(tickLength);

                var numTicks = Number(interval)>0 ? Number(total)/Number(interval) : 0,
                    beta = 2 * Math.PI/numTicks,
                    precision = -1,
                    d = '';


                for (i = 0; i < numTicks; i++) {
                    var alpha = beta * i - Math.PI / 2, cos = Math.cos(alpha), sin = Math.sin(alpha);
                    d += "M" + Math.round10((x + (radius * cos)), precision) + "," + Math.round10((y + (radius * sin)), precision) + " L" + Math.round10((x + ((radius + tickLength) * cos)), precision) + "," + Math.round10((y + ((radius + tickLength) * sin)), precision) + " ";
                }
                return d;

            }
        },
        getElements : {
            label : function(x, y, radius, interval, total){

                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                interval = Number(interval);
                total = Number(total);

                var numTicks = Number(interval)>0 ? Number(total)/Number(interval) : 0,
                    beta = 2 * Math.PI/numTicks,
                    precision = -1,
                    labelArr = [];


                for (i = 0; i < numTicks; i++) {
                    var alpha = beta * i - Math.PI / 2, cos = Math.cos(alpha), sin = Math.sin(alpha);
                    labelArr.push({
                        x : Math.round10((x + (radius * cos)), precision),
                        y : Math.round10((y + (radius * sin)), precision),
                        text : interval * i
                    });
                }
                return labelArr;

            }
        }
    };
    */
});