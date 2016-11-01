$(function () {
    var canvas = $('canvas');
    setup_start_and_goal(canvas);
    setup_save(canvas);
    setup_drawing(canvas);
    setup_ros(canvas);

    $('input[name=canvas-width]').on('change', function (e) {
        var width = parseInt($(this).val());
        canvas.attr('width', width);
        canvas.drawLayers();
    });

    $('input[name=canvas-height]').on('change', function (e) {
        var height = parseInt($(this).val());
        canvas.attr('height', height);
        canvas.drawLayers();
    });

    window.path = {
        segments: [
            {
                configIntervalType: "ACI",
                arc_start: 3.1,
                delta: -2.4,
                direction: false,
                orientation: true,
                radius: 40,
                center: {x: 100, y: 500},
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
                y1: canvas.height() - segment.start.y,
                x2: segment.end.x,
                y2: canvas.height() - segment.end.y
            });
        } else if (segment.configIntervalType === "ACI") {
            var start_theta = segment.arc_start;
            var delta_theta = segment.delta;
            console.log('start_theta: ' + start_theta + ' delta_theta: ' + delta_theta + ' dir: ' + segment.direction + ' orientation: ' + segment.orientation);

            var orientation = Math.abs(delta_theta) < Math.PI ? segment.orientation : !segment.orientation;
            var direction = Math.abs(delta_theta) < Math.PI ? segment.direction : !segment.direction;
            canvas.drawArc({
                strokeStyle: orientation ? '#000' : '#00f',
                strokeWidth: 1,
                x: segment.center.x,
                y: canvas.height() - segment.center.y,
                radius: segment.radius,
                layer: true,
                endArrow: true,
                arrowRadius: 7,
                arrowAngle: 1,
                groups: [window.groups.path],
                start: 1.57079633 - segment.arc_start,
                end: 1.57079633 - (segment.arc_start + directed_angle_dist(delta_theta, segment.direction)),
                ccw: direction
            });
        }
    }

});
