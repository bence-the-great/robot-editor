function test_path_follower(canvas) {
    window.path = {
        segments: [
            {
                configIntervalType: "TCI",
                arc_start: 0,
                delta: 0,
                direction: true,
                orientation: true,
                radius: 0,
                center: {x: 0, y: 0},
                start: {x: 70, y: 150},
                end: {x: 160, y: 160}
            },
            {
                configIntervalType: "ACI",
                arc_start: 1.57,
                delta: 3.14,
                direction: true,
                orientation: false,
                radius: 40,
                center: {x: 160, y: 200},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            },
            {
                configIntervalType: "TCI",
                arc_start: 0,
                delta: 0,
                direction: true,
                orientation: false,
                radius: 0,
                center: {x: 0, y: 0},
                start: {x: 160, y: 240},
                end: {x: 200, y: 240}
            },
            {
                configIntervalType: "ACI",
                arc_start: 1.57,
                delta: 3.14,
                direction: true,
                orientation: true,
                radius: 40,
                center: {x: 200, y: 280},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            },
            {
                configIntervalType: "ACI",
                arc_start: 1.57,
                delta: -1.12,
                direction: false,
                orientation: true,
                radius: 40,
                center: {x: 200, y: 360},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            }
        ]
    };

    for (var index in window.path.segments) {
        var segment = window.path.segments[index];
        if (segment.configIntervalType === "TCI") {
            canvas.drawLine({
                strokeStyle: segment.orientation ? '#000' : '#00f',
                strokeWidth: 1,
                layer: true,
                endArrow: true,
                arrowRadius: 7,
                arrowAngle: 1,
                groups: [window.groups.path],
                x1: segment.start.x,
                y1: segment.start.y,
                x2: segment.end.x,
                y2: segment.end.y
            });
        } else if (segment.configIntervalType === "ACI") {
            canvas.drawArc({
                strokeStyle: segment.orientation ? '#000' : '#00f',
                strokeWidth: 1,
                x: segment.center.x,
                y: segment.center.y,
                radius: segment.radius,
                layer: true,
                endArrow: true,
                arrowRadius: 7,
                arrowAngle: 1,
                groups: [window.groups.path],
                start: 1.57079633 - segment.arc_start,
                end: 1.57079633 - (segment.arc_start + segment.delta),
                ccw: segment.direction
            });
        }
    }
}