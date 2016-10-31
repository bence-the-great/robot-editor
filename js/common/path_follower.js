function start_following(robot_position, path) {
    var canvas = $('canvas');
    var active_segment_index = 0;
    var active_segment = path.segments[active_segment_index];

    canvas.removeLayerGroup(window.groups.path);

    if (active_segment.configIntervalType === "TCI") {
        canvas.drawLine({
            strokeStyle: active_segment.orientation ? '#000' : '#00f',
            strokeWidth: 1,
            layer: true,
            endArrow: true,
            arrowRadius: 7,
            arrowAngle: 1,
            groups: [window.groups.path],
            x1: active_segment.start.x,
            y1: canvas.height() - active_segment.start.y,
            x2: active_segment.end.x,
            y2: canvas.height() - active_segment.end.y
        });

        console.log(closest_point({
            start: {
                x: active_segment.start.x,
                y: canvas.height() - active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: canvas.height() - active_segment.end.y
            }
        }, robot_position));
    }
}
