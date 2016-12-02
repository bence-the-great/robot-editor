function circle_circle(canvas, circle1, circle2) {
    var d = Math.sqrt(distance_squared(circle1.center, circle2.center));

    /* Check for solvability. */
    if (d > (circle1.radius + circle2.radius)) {
        /* no solution. circles do not intersect. */
        console.log('no intersection');
        return [];
    }
    if (d < Math.abs(circle1.radius - circle2.radius)) {
        /* no solution. one circle is contained in the other */
        console.log('no intersection');
        return [];
    }

    var x = (Math.pow(d, 2) - Math.pow(circle2.radius, 2) + Math.pow(circle1.radius, 2)) / (2 * d);
    var angle = Math.atan2(circle2.center.y - circle1.center.y, circle2.center.x - circle1.center.x);

    if (Math.abs(d - Math.abs(circle1.radius - circle2.radius)) < 1) {
        var result = {
            x: circle1.center.x + Math.cos(angle) * x,
            y: circle1.center.y + Math.sin(angle) * x
        };
        if (between(result, circle1) && between(result, circle2)) {
            return [result];
        }
    } else {
        var a1 = -d + circle2.radius - circle1.radius;
        var a2 = -d - circle2.radius + circle1.radius;
        var a3 = -d + circle2.radius + circle1.radius;
        var a4 = d + circle2.radius + circle1.radius;
        var a = Math.sqrt(a1 * a2 * a3 * a4) / d;

        var result1 = {
            x: (circle1.center.x + Math.cos(angle) * x) + Math.cos(angle + Math.PI / 2) * a / 2,
            y: (circle1.center.y + Math.sin(angle) * x) + Math.sin(angle + Math.PI / 2) * a / 2
        };
        var result2 = {
            x: (circle1.center.x + Math.cos(angle) * x) - Math.cos(angle + Math.PI / 2) * a / 2,
            y: (circle1.center.y + Math.sin(angle) * x) - Math.sin(angle + Math.PI / 2) * a / 2
        };
        var results = [];
        if (between(result1, circle1) && between(result1, circle2)) {
            results.push(result1);
        }
        if (between(result2, circle1) && between(result2, circle2)) {
            results.push(result2);
        }
        return results;
    }
}

function line_circle(canvas, line, arc) {
    var aa = {
        x: line.start.x - arc.center.x,
        y: line.start.y - arc.center.y
    };
    var bb = {
        x: line.end.x - arc.center.x,
        y: line.end.y - arc.center.y
    };

    var d = subtract(bb, aa);
    var length = Math.sqrt(distance_squared(aa, bb));
    var D = (aa.x * bb.y) - (bb.x * aa.y);
    var discriminant = Math.pow(arc.radius, 2) * Math.pow(length, 2) - Math.pow(D, 2);

    console.log('discriminant: ' + discriminant);
    if (discriminant < 0) {
        console.log('no intersection');
        return [];
    } else if (discriminant === 0) {
        console.log('tangent');
        var dy_sign = d.y === 0 ? 1 : Math.sign(d.y);
        var asd = dy_sign * d.x * Math.sqrt(discriminant);
        var asd2 = Math.abs(d.y) * Math.sqrt(discriminant);
        var result = {
            x: arc.center.x + (D * d.y + asd) / Math.pow(length, 2),
            y: arc.center.y + (-D * d.x + asd2) / Math.pow(length, 2)
        };
        if (between(result, arc)) {
            return [result];
        } else {
            return [];
        }

    } else {
        console.log('intersect');
        var dy_sign = d.y === 0 ? 1 : Math.sign(d.y);
        var asd = dy_sign * d.x * Math.sqrt(discriminant);
        var asd2 = Math.abs(d.y) * Math.sqrt(discriminant);
        var result_1 = {
            x: arc.center.x + (D * d.y + asd) / Math.pow(length, 2),
            y: arc.center.y + (-D * d.x + asd2) / Math.pow(length, 2)
        };
        var result_2 = {
            x: arc.center.x + (D * d.y - asd) / Math.pow(length, 2),
            y: arc.center.y + (-D * d.x - asd2) / Math.pow(length, 2)
        };
        var results = [];
        if (between(result_1, arc) && point_is_inside(line, result_1)) {
            results.push(result_1);
        }
        if (between(result_2, arc) && point_is_inside(line, result_2)) {
            results.push(result_2);
        }
        return results;
    }
}

function line_line(canvas, line1, line2) {
    var a = line1.start;
    var b = line1.end;
    var c = line2.start;
    var d = line2.end;
    var s1 = subtract(b, a);
    var s2 = subtract(d, c);

    var s = (-s1.y * (a.x - c.x) + s1.x * (a.y - c.y)) / (-s2.x * s1.y + s1.x * s2.y);
    var t = ( s2.x * (a.y - c.y) - s2.y * (a.x - c.x)) / (-s2.x * s1.y + s1.x * s2.y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        var angle = Math.atan2(b.y - a.y, b.x - a.x);
        return {
            x: a.x + t * Math.sqrt(distance_squared(a, b)) * Math.cos(angle),
            y: a.y - t * Math.sqrt(distance_squared(a, b)) * Math.sin(-angle)
        };
    } else {
        return null;
    }
}

function between(position, segment) {
    var angle = corrigate_angle2(Math.atan2((-position.y) - (-segment.center.y), position.x - segment.center.x));
    var point = {
        x: segment.center.x + segment.radius * Math.cos(angle),
        y: segment.center.y - segment.radius * Math.sin(angle)
    };
    var distance_from_start = corrigate_angle2(Math.atan2((-point.y) - (-segment.center.y), point.x - segment.center.x) - segment.arc_start);

    if (segment.direction) {  // ccw
        return Math.abs(distance_from_start) <= Math.abs(segment.delta);
    } else {  // cw
        return Math.abs(distance_from_start) >= (2 * Math.PI - Math.abs(segment.delta));
    }
}

function test_data(canvas) {
    // window.paths = [{
    //     segments: [
    //         {
    //             configIntervalType: "TCI",
    //             arc_start: 0,
    //             delta: 0,
    //             direction: true,
    //             orientation: true,
    //             radius: 0,
    //             center: {x: 0, y: 0},
    //             start: {x: 70, y: 150},
    //             end: {x: 160, y: 160}
    //         },
    //         {
    //             configIntervalType: "ACI",
    //             arc_start: 1.57,
    //             delta: 3.14,
    //             direction: true,
    //             orientation: false,
    //             radius: 40,
    //             center: {x: 160, y: 200},
    //             start: {x: 0, y: 0},
    //             end: {x: 0, y: 0}
    //         },
    //         {
    //             configIntervalType: "TCI",
    //             arc_start: 0,
    //             delta: 0,
    //             direction: true,
    //             orientation: false,
    //             radius: 0,
    //             center: {x: 0, y: 0},
    //             start: {x: 160, y: 240},
    //             end: {x: 200, y: 240}
    //         },
    //         {
    //             configIntervalType: "ACI",
    //             arc_start: 1.57,
    //             delta: 3.14,
    //             direction: true,
    //             orientation: true,
    //             radius: 40,
    //             center: {x: 200, y: 280},
    //             start: {x: 0, y: 0},
    //             end: {x: 0, y: 0}
    //         },
    //         {
    //             configIntervalType: "ACI",
    //             arc_start: 1.57,
    //             delta: -1.12,
    //             direction: false,
    //             orientation: true,
    //             radius: 40,
    //             center: {x: 200, y: 360},
    //             start: {x: 0, y: 0},
    //             end: {x: 0, y: 0}
    //         }
    //     ]
    // }, {
    //     segments: [{
    //         configIntervalType: "TCI",
    //         arc_start: 0,
    //         delta: 0,
    //         direction: true,
    //         orientation: true,
    //         radius: 0,
    //         center: {x: 0, y: 0},
    //         start: {x: 70, y: 100},
    //         end: {x: 240, y: 360}
    //     }]
    // }];
    //
    // for (var i in window.paths) {
    //     var path = window.paths[i];
    //     for (var index in path.segments) {
    //         var segment = path.segments[index];
    //         if (segment.configIntervalType === "TCI") {
    //             canvas.drawLine({
    //                 strokeStyle: segment.orientation ? '#000' : '#00f',
    //                 strokeWidth: 1,
    //                 layer: true,
    //                 endArrow: true,
    //                 arrowRadius: 7,
    //                 arrowAngle: 1,
    //                 groups: [window.groups.path],
    //                 x1: segment.start.x,
    //                 y1: segment.start.y,
    //                 x2: segment.end.x,
    //                 y2: segment.end.y
    //             });
    //         } else if (segment.configIntervalType === "ACI") {
    //             canvas.drawArc({
    //                 strokeStyle: segment.orientation ? '#000' : '#00f',
    //                 strokeWidth: 1,
    //                 x: segment.center.x,
    //                 y: segment.center.y,
    //                 radius: segment.radius,
    //                 layer: true,
    //                 endArrow: true,
    //                 arrowRadius: 7,
    //                 arrowAngle: 1,
    //                 groups: [window.groups.path],
    //                 start: 1.57079633 - segment.arc_start,
    //                 end: 1.57079633 - (segment.arc_start + segment.delta),
    //                 ccw: segment.direction
    //             });
    //         }
    //     }
    // }

    var circle1 = {
        center: {
            x: 750,
            y: 400
        },
        radius: 50,
        arc_start: -1.2,
        delta: 5.77,
        direction: true
    };
    var circle2 = {
        center: {
            x: 800,
            y: 450
        },
        radius: 95,
        arc_start: -1.2,
        delta: -2.77,
        direction: false
    };
    canvas.drawArc({
        strokeStyle: '#000',
        layer: true,
        x: circle1.center.x,
        y: circle1.center.y,
        radius: circle1.radius,
        start: 1.57079633 - circle1.arc_start,
        end: 1.57079633 - (circle1.arc_start + circle1.delta),
        ccw: circle1.direction
    });
    canvas.drawArc({
        strokeStyle: '#000',
        layer: true,
        x: circle2.center.x,
        y: circle2.center.y,
        radius: circle2.radius,
        start: 1.57079633 - circle2.arc_start,
        end: 1.57079633 - (circle2.arc_start + circle2.delta),
        ccw: circle2.direction
    });
    var results = circle_circle(canvas, circle1, circle2);
    for (var result_i in results) {
        var result = results[result_i];
        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: result.x,
            y: result.y,
            width: 100, height: 100
        });
    }

    var line1 = {
        start: {
            x: 320,
            y: 300
        },
        end: {
            x: 400,
            y: 200
        }
    };
    var line2 = {
        start: {
            x: 300,
            y: 200
        },
        end: {
            x: 400,
            y: 400
        }
    };

    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: line1.start.x,
        y1: line1.start.y,
        x2: line1.end.x,
        y2: line1.end.y
    });

    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: line2.start.x,
        y1: line2.start.y,
        x2: line2.end.x,
        y2: line2.end.y
    });
    var line_line_result = line_line(canvas, line1, line2);
    if (line_line_result !== null) {
        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: line_line_result.x,
            y: line_line_result.y,
            width: 100, height: 100
        });
    }

    var arc = {
        center: {
            x: 650,
            y: 250
        },
        radius: 50,
        arc_start: -1.2,
        delta: 5.77,
        direction: true
    };
    var line = {
        start: {
            x: 750,
            y: 300
        },
        end: {
            x: 640,
            y: 170
        }
    };
    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: line.start.x,
        y1: line.start.y,
        x2: line.end.x,
        y2: line.end.y
    });
    canvas.drawArc({
        strokeStyle: '#000',
        layer: true,
        x: arc.center.x,
        y: arc.center.y,
        radius: arc.radius,
        start: 1.57079633 - arc.arc_start,
        end: 1.57079633 - (arc.arc_start + arc.delta),
        ccw: arc.direction
    });

    var results2 = line_circle(canvas, line, arc);
    for (var result_i2 in results2) {
        var result2 = results2[result_i2];
        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: result2.x,
            y: result2.y,
            width: 100, height: 100
        });
    }
}
