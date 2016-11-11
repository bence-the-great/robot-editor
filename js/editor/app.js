$(function () {
    var canvas = $('canvas');
    setup_start_and_goal(canvas);
    setup_save(canvas);
    setup_drawing(canvas);
    // setup_ros(canvas);

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
                configIntervalType: "TCI",
                arc_start: 0,
                delta: 0,
                direction: true,
                orientation: true,
                radius: 0,
                center: {x: 0, y: 0},
                start: {x: 80, y: canvas.height() - 160},
                end: {x: 160, y: canvas.height() - 160}
            },
            {
                configIntervalType: "ACI",
                arc_start: 1.57,
                delta: -3.14,
                direction: false,
                orientation: true,
                radius: 40,
                center: {x: 160, y: canvas.height() - 200},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            },
            {
                configIntervalType: "TCI",
                arc_start: 0,
                delta: 0,
                direction: true,
                orientation: true,
                radius: 0,
                center: {x: 0, y: 0},
                start: {x: 160, y: canvas.height() - 240},
                end: {x: 130, y: canvas.height() - 240}
            },
            {
                configIntervalType: "ACI",
                arc_start: 1.57,
                delta: 3.14,
                direction: true,
                orientation: true,
                radius: 40,
                center: {x: 130, y: canvas.height() - 280},
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            },

            // {
            //     configIntervalType: "TCI",
            //     arc_start: 0,
            //     delta: 0,
            //     direction: true,
            //     orientation: true,
            //     radius: 0,
            //     center: {x: 0, y: 0},
            //     start: {x: 300, y: canvas.height() - 250},
            //     end: {x: 400, y: canvas.height() - 250}
            // },
            // {
            //     configIntervalType: "TCI",
            //     arc_start: 0,
            //     delta: 0,
            //     direction: true,
            //     orientation: true,
            //     radius: 0,
            //     center: {x: 0, y: 0},
            //     start: {x: 400, y: canvas.height() - 250},
            //     end: {x: 450, y: canvas.height() - 350}
            // },
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
            canvas.drawArc({
                strokeStyle: segment.orientation ? '#000' : '#00f',
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
                end: 1.57079633 - (segment.arc_start + segment.delta),
                ccw: segment.direction
            });
        }
    }

});
