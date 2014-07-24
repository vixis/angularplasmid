/*global angular*/
(function () {
    
    'use strict';
    
    angular.module("angularplasmid.services", [])
    
         .factory("SVGUtil", function () {
            /*
                PUBLIC API
                -----------------------------------------------------------------------
                api - API for working with AngularPlasmid objects on a page
                util - General utilities
                svg - SVG node, path calculations
            */

            var plasmids = [], tracks = [], markers = [];

            // Decimal round with precision
            function round10(value, exp) {
                var type = 'round';
                // If the exp is undefined or zero...
                if (typeof exp === 'undefined' || +exp === 0) {
                    return Math[type](value);
                }
                value = +value;
                exp = +exp;
                // If the value is not a number or the exp is not an integer...
                if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                    return NaN;
                }
                // Shift
                value = value.toString().split('e');
                value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
                // Shift back
                value = value.toString().split('e');
                return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
            }

            function addPlasmid(plasmid) {
                plasmids.push(plasmid);
            }
            function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            }

            function swapProperties(elemFrom, elemTo) {
                var PROPLIST = ['id', 'name', 'class', 'style', 'filter'],
                    property,
                    i;

                for (i = 0; i < PROPLIST.length; i += 1) {
                    property = PROPLIST[i];
                    elemTo.attr(property, elemFrom.attr(property));
                    elemFrom.removeAttr(property);
                }
            }

            function createNode(name, settings, excludeSettings) {
                var namespace = 'http://www.w3.org/2000/svg',
                    node = document.createElementNS(namespace, name),
                    attribute,
                    value;

                excludeSettings = excludeSettings || [];
                angular.forEach(settings, function (attribute) {
                    if (excludeSettings.indexOf(attribute) < 0) {
                        value = settings[attribute];
                        if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
                            node.setAttribute(attribute, value);
                        }
                    }
                });
                return node;
            }

            function removeAttributes(element) {
                angular.forEach(['id', 'class', 'style'], function (a) {
                    element.removeAttribute(a);
                });
            }

            function pathDonut(x, y, radius, width) {
                var innerRing, outerRing, path;
                
                x = Number(x || 0);
                y = Number(y || 0);
                radius = Number(radius || 0);
                width = Number(width || 0);
                
                innerRing = {
                    start : polarToCartesian(x, y, radius, 359.99),
                    end : polarToCartesian(x, y, radius, 0)
                };

                outerRing = {
                    start : polarToCartesian(x, y, radius + width, 359.99),
                    end : polarToCartesian(x, y, radius + width, 0)
                };

                path = [    "M", innerRing.start.x, innerRing.start.y,
                                "A", radius, radius, 0, 1, 0, innerRing.end.x, innerRing.end.y,
                                "M", outerRing.start.x, outerRing.start.y,
                                "A", radius + width, radius + width, 0, 1, 0, outerRing.end.x, outerRing.end.y
                            ].join(" ");

                return path;
            }

            function pathArc(x, y, radius, startAngle, endAngle, width, arrowStart, arrowEnd) {
                var d, start, start2, end, arcSweep, arrow_start_1, arrow_start_2, arrow_start_3, arrow_start_4, arrow_end_1, arrow_end_2, arrow_end_3, arrow_end_4;

                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                startAngle = Number(startAngle);
                endAngle = Number(endAngle);
                width = Number(width);
                arrowStart = arrowStart || {width : 0, length : 0, angle: 0};
                arrowEnd = arrowEnd || {width : 0, length : 0, angle: 0};

                if (startAngle === endAngle) {
                    // Draw a line
                    start = polarToCartesian(x, y, radius, startAngle);
                    end = polarToCartesian(x, y, radius + width, startAngle);
                    d = ["M", start.x, start.y, "L", end.x, end.y].join(" ");
                } else {
                    //Draw a "simple" arc if the width is 1
                    if (width === 1) {
                        start = polarToCartesian(x, y, radius, startAngle);
                        end = polarToCartesian(x, y, radius, endAngle);
                        if (startAngle < endAngle) {
                            arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                        } else {
                            arcSweep = endAngle - startAngle <= 180 ? "1" : "0";
                        }
                        d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 1, end.x, end.y].join(" ");
                    } else {

                        // Draw a "complex" arc (We start drawing in reverse, which is why start uses endAngle)
                        endAngle = endAngle - (arrowEnd.length < 0 ? 0 : arrowEnd.length);
                        startAngle = startAngle + (arrowStart.length < 0 ? 0 : arrowStart.length);
                        start = polarToCartesian(x, y, radius, endAngle);
                        end = polarToCartesian(x, y, radius, startAngle);
                        arrow_start_1 = polarToCartesian(x, y, radius - arrowStart.width, startAngle + arrowStart.angle);
                        arrow_start_2 = polarToCartesian(x, y, radius + (width / 2), startAngle - arrowStart.length);
                        arrow_start_3 = polarToCartesian(x, y, radius + width + arrowStart.width, startAngle + arrowStart.angle);
                        arrow_start_4 = polarToCartesian(x, y, radius + width, startAngle);
                        arrow_end_1 = polarToCartesian(x, y, radius + width + arrowEnd.width, endAngle - arrowEnd.angle);
                        arrow_end_2 = polarToCartesian(x, y, radius + (width / 2), endAngle + arrowEnd.length);
                        arrow_end_3 = polarToCartesian(x, y, radius - arrowEnd.width, endAngle - arrowEnd.angle);
                        arrow_end_4 = polarToCartesian(x, y, radius, endAngle);
                        start2 = polarToCartesian(x, y, radius + width, endAngle);
                        arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                        d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y, "L", arrow_start_1.x, arrow_start_1.y, "L", arrow_start_2.x, arrow_start_2.y, "L", arrow_start_3.x, arrow_start_3.y, "L", arrow_start_4.x, arrow_start_4.y, "A", radius + width, radius + width, 0, arcSweep, 1, start2.x, start2.y, "L", arrow_end_1.x, arrow_end_1.y, "L", arrow_end_2.x, arrow_end_2.y, "L", arrow_end_3.x, arrow_end_3.y, "L", arrow_end_4.x, arrow_end_4.y, "z"].join(" ");
                    }
                }

                return d;
            }

            function pathScale(x, y, radius, interval, total, tickLength) {

                x = Number(x || 0);
                y = Number(y || 0);
                radius = Number(radius || 0);
                interval = Number(interval || 0);
                total = Number(total || 0);
                tickLength = Number(tickLength || 2);

                var alpha, sin, cos, i,
                    numTicks = Number(interval) > 0 ? Number(total) / Number(interval) : 0,
                    beta = 2 * Math.PI / numTicks,
                    precision = -1,
                    d = '';

                for (i = 0; i < numTicks; i += 1) {
                    alpha = beta * i - Math.PI / 2;
                    cos = Math.cos(alpha);
                    sin = Math.sin(alpha);
                    d += "M" + round10((x + (radius * cos)), precision) + "," + round10((y + (radius * sin)), precision) + " L" + round10((x + ((radius + tickLength) * cos)), precision) + "," + round10((y + ((radius + tickLength) * sin)), precision) + " ";
                }
                d = d || "M 0,0";
                return d;

            }

            function elementScaleLabels(x, y, radius, interval, total) {

                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                interval = Number(interval);
                total = Number(total);

                var alpha, sin, cos, i,
                    numTicks = Number(interval) > 0 ? Number(total) / Number(interval) : 0,
                    beta = 2 * Math.PI / numTicks,
                    precision = -1,
                    labelArr = [];


                for (i = 0; i < numTicks; i += 1) {
                    alpha = beta * i - Math.PI / 2;
                    cos = Math.cos(alpha);
                    sin = Math.sin(alpha);
                    labelArr.push({
                        x : round10((x + (radius * cos)), precision),
                        y : round10((y + (radius * sin)), precision),
                        text : interval * i
                    });
                }
                return labelArr;

            }

            return {
                api : {
                    addPlasmid : addPlasmid,
                    plasmids : plasmids,
                    plasmidtracks : tracks,
                    trackmarkers : markers
                },
                util : {
                    polarToCartesian : polarToCartesian,
                    swapProperties : swapProperties
                },
                svg : {
                    createNode : createNode,
                    removeAttributes : removeAttributes,
                    path : {
                        donut : pathDonut,
                        arc : pathArc,
                        scale : pathScale
                    },
                    element : {
                        scalelabels : elementScaleLabels
                    }
                }
            };

        });
}());
