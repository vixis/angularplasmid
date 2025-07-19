function round10(value, exp) {
    const type = 'round';
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

export function pathDonut(x, y, radius, width) {
    x = Number(x || 0);
    y = Number(y || 0);
    radius = Number(radius || 0);
    width = Number(width || 0);

    const innerRing = {
        start: polarToCartesian(x, y, radius, 359.99),
        end: polarToCartesian(x, y, radius, 0)
    };

    const outerRing = {
        start: polarToCartesian(x, y, radius + width, 359.99),
        end: polarToCartesian(x, y, radius + width, 0)
    };

    const path = [
        "M", innerRing.start.x, innerRing.start.y,
        "A", radius, radius, 0, 1, 0, innerRing.end.x, innerRing.end.y,
        "M", outerRing.start.x, outerRing.start.y,
        "A", radius + width, radius + width, 0, 1, 0, outerRing.end.x, outerRing.end.y
    ].join(" ");

    return path;
}

export function pathArc(x, y, radius, startAngle, endAngle, width, arrowStart, arrowEnd) {
    let d, start, start2, end, arcSweep, arrow_start_1, arrow_start_2, arrow_start_3, arrow_start_4, arrow_end_1, arrow_end_2, arrow_end_3, arrow_end_4;

    x = Number(x);
    y = Number(y);
    radius = Number(radius);
    startAngle = Number(startAngle);
    endAngle = Number(endAngle);
    width = Number(width);
    arrowStart = arrowStart || { width: 0, length: 0, angle: 0 };
    arrowEnd = arrowEnd || { width: 0, length: 0, angle: 0 };

    if (startAngle === endAngle) {
        start = polarToCartesian(x, y, radius, startAngle);
        end = polarToCartesian(x, y, radius + width, startAngle);
        d = ["M", start.x, start.y, "L", end.x, end.y].join(" ");
    } else {
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

export function pathScale(x, y, radius, interval, total, tickLength) {
    x = Number(x || 0);
    y = Number(y || 0);
    radius = Number(radius || 0);
    interval = Number(interval || 0);
    total = Number(total || 0);
    tickLength = Number(tickLength || 2);

    let alpha, sin, cos, i;
    const numTicks = Number(interval) > 0 ? Number(total) / Number(interval) : 0;
    const beta = 2 * Math.PI / numTicks;
    const precision = -1;
    let d = '';

    for (i = 0; i < numTicks; i += 1) {
        alpha = beta * i - Math.PI / 2;
        cos = Math.cos(alpha);
        sin = Math.sin(alpha);
        d += "M" + round10((x + (radius * cos)), precision) + "," + round10((y + (radius * sin)), precision) + " L" + round10((x + ((radius + tickLength) * cos)), precision) + "," + round10((y + ((radius + tickLength) * sin)), precision) + " ";
    }
    d = d || "M 0,0";
    return d;
}

export function elementScaleLabels(x, y, radius, interval, total) {
    x = Number(x);
    y = Number(y);
    radius = Number(radius);
    interval = Number(interval);
    total = Number(total);

    let alpha, sin, cos, i;
    const numTicks = Number(interval) > 0 ? Number(total) / Number(interval) : 0;
    const beta = 2 * Math.PI / numTicks;
    const precision = -1;
    const labelArr = [];

    for (i = 0; i < numTicks; i += 1) {
        alpha = beta * i - Math.PI / 2;
        cos = Math.cos(alpha);
        sin = Math.sin(alpha);
        labelArr.push({
            x: round10((x + (radius * cos)), precision),
            y: round10((y + (radius * sin)), precision),
            text: interval * i
        });
    }
    return labelArr;
}

export function Numeric(numberVal, numberDefault) {
    return isNaN(numberVal) ? numberDefault || 0 : Number(numberVal);
}

export function swapProperties(elemFrom, elemTo) {
    const PROPLIST = ['id', 'name', 'class', 'style', 'filter'];
    
    PROPLIST.forEach(property => {
        if (elemFrom.hasAttribute && elemFrom.hasAttribute(property)) {
            const value = elemFrom.getAttribute(property);
            if (value) {
                elemTo.setAttribute(property, value);
                elemFrom.removeAttribute(property);
            }
        }
    });
}

export function createSVGNode(name, settings = {}) {
    const namespace = 'http://www.w3.org/2000/svg';
    const node = document.createElementNS(namespace, name);
    
    Object.keys(settings).forEach(attribute => {
        const value = settings[attribute];
        if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
            node.setAttribute(attribute, value);
        }
    });
    
    return node;
}
