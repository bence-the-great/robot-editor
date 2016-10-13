function draw_segments(canvas, segments) {
    for (var i in segments) {
        var segment = segments[i];
        if (segment.configIntervalType === 'TCI') {
            draw_line(canvas, segment);
        } else if (segment.configIntervalType === 'ACI') {
            draw_arc(canvas, segment);
        }
    }
}

function draw_line(canvas, segment) {
    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        groups: window.groups.path,
        x1: segment.start.x,
        y1: segment.start.y,
        x2: segment.end.x,
        y2: segment.end.y
    });
}

function draw_arc(canvas, segment) {
    canvas.drawArc({
        strokeStyle: '#000',
        strokeWidth: 1,
        x: segment.center.x,
        y: segment.center.y,
        radius: segment.radius,
        layer: true,
        groups: window.groups.path,
        start: segment.arc_start,
        end: segment.arc_start + segment.delta
    });
}
