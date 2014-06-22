app.factory("PlasmidLib", function(){

    var items = {};

    function addItem(item){
        if (item.id){
            items.id = item;
        }
    }
    function addPlasmid(plasmid){
        var item;

    }
});

app.factory("SVGUtil", function() {
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    return {
        createSVGNode: function(name, settings, excludeSettings) {
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
        },
        polarToCartesian : polarToCartesian,
        getPath: {
            donut: function(x, y, radius, width) {
                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                width = Number(width);
                var start = polarToCartesian(x, y, radius, 359.9999);
                var end = polarToCartesian(x, y, radius, 0);
                var start2 = polarToCartesian(x, y, radius + width, 359.9999);
                var end2 = polarToCartesian(x, y, radius + width, 0);
                var d = ["M", start.x, start.y, "A", radius, radius, 0, 1, 0, end.x, end.y, "M", start2.x, start2.y, "A", radius + width, radius + width, 0, 1, 0, end2.x, end2.y, ].join(" ");
                return d;
            },
            arc: function(x, y, radius, startAngle, endAngle, width, arrowStart, arrowEnd) {
                x = Number(x);
                y = Number(y);
                radius = Number(radius);
                startAngle = Number(startAngle);
                endAngle = Number(endAngle);
                width = Number(width);

                if (typeof arrowStart != "object") {
                    if (arrowStart) {
                        arrowStart = {
                            width: 0,
                            angle: 0,
                            length: (width / 6)
                        };
                    } else {
                        arrowStart = {
                            width: 0,
                            angle: 0,
                            length: 0
                        };
                    }
                }
                if (typeof arrowEnd != "object") {
                    if (arrowEnd) {
                        arrowEnd = {
                            width: 0,
                            angle: 0,
                            length: (width / 6)
                        };
                    } else {
                        arrowEnd = {
                            width: 0,
                            angle: 0,
                            length: 0
                        };
                    }
                }
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
            },
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
});