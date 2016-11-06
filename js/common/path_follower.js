window.active_segment_index = 0;

function step() {
    var canvas = $('canvas');
    var es = canvas.getLayerGroup('start');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];

    position.x += robot.wheelbase * Math.cos(position.rotate);
    position.y += robot.wheelbase * Math.sin(position.rotate);

    if (active_segment.configIntervalType === 'TCI') {
        var d = closest_point({
            start: {
                x: active_segment.start.x,
                y: canvas.height() - active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: canvas.height() - active_segment.end.y
            }
        }, position);

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: d.point.x, y: d.point.y,
            width: 5, height: 5
        });
        canvas.drawEllipse({
            fillStyle: '#0f0',
            layer: true,
            groups: ['projected'],
            x: position.x, y: position.y,
            width: 5, height: 5
        });

        var pos_error = Math.sign(d.angle_diff) * Math.sqrt(Math.pow(d.point.x - position.x, 2) + Math.pow(d.point.y - position.y, 2));
        var pos_output = 0.03 * pos_error;
        var aggregated_output = Math.sign(pos_output) * Math.min(Math.abs(pos_output), 0.5);
        console.log('output: ' + aggregated_output);

        for (var index in es) {
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
            es[index].x += 1.5 * Math.cos(es[index].rotate);
            es[index].y += 1.5 * Math.sin(es[index].rotate);
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
        }
        canvas.drawLayers();

        var distance = Math.sqrt(Math.pow(active_segment.end.x - d.point.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - d.point.y, 2));
        if (distance < 2) {
            window.active_segment_index += 1;
        }
    } else if (active_segment.configIntervalType === 'ACI') {
        var angle = Math.PI - Math.atan2((canvas.height() - active_segment.center.y) - position.y, active_segment.center.x - position.x);

        var dist_from_start = Math.abs(corrigate_angle(Math.abs(angle - active_segment.arc_start)));
        var dist_from_end = Math.abs(corrigate_angle(Math.abs(angle - (active_segment.arc_start + active_segment.delta))));

        if (corrigate_angle(angle) > Math.max(corrigate_angle(active_segment.arc_start), corrigate_angle(active_segment.arc_start + active_segment.delta))) {
            if (dist_from_start < dist_from_end) {
                angle = active_segment.arc_start;
            } else {
                angle = active_segment.arc_start + active_segment.delta;
            }
        } else if (corrigate_angle(angle) < Math.min(corrigate_angle(active_segment.arc_start), corrigate_angle(active_segment.arc_start + active_segment.delta))) {
            if (dist_from_start < dist_from_end) {
                angle = active_segment.arc_start;
            } else {
                angle = active_segment.arc_start + active_segment.delta;
            }
        }

        var point_x = active_segment.center.x + active_segment.radius * Math.cos(angle);
        var point_y = (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(angle);
        var point_angle = Math.atan2(-(point_x - active_segment.center.x), (point_y - (canvas.height() - active_segment.center.y)));
        var angle_diff =  angle - point_angle;

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: point_x,
            y: point_y,
            width: 5, height: 5
        });
        canvas.drawEllipse({
            fillStyle: '#0f0',
            layer: true,
            groups: ['projected'],
            x: position.x, y: position.y,
            width: 5, height: 5
        });

        var pos_error = Math.sign(angle_diff) * Math.sqrt(Math.pow(point_x - position.x, 2) + Math.pow(point_y - position.y, 2));
        var pos_output = 0.1 * pos_error;
        var aggregated_output = Math.sign(pos_output) * Math.min(Math.abs(pos_output), 0.7);
        console.log('output: ' + aggregated_output);

        for (var index in es) {
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
            es[index].x += 1.5 * Math.cos(es[index].rotate);
            es[index].y += 1.5 * Math.sin(es[index].rotate);
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
        }
        canvas.drawLayers();

        var s = active_segment.center.x + active_segment.radius * Math.cos(active_segment.arc_start + active_segment.delta);
        var e = (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(active_segment.arc_start + active_segment.delta);
        var distance = Math.sqrt(Math.pow(s - point_x, 2) + Math.pow(e - point_y, 2));

        if (distance < 2) {
            window.active_segment_index += 1;
        }
    }
}

function highlight_closest_point() {
    var canvas = $('canvas');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    if (active_segment.configIntervalType === 'TCI') {
        var d = closest_point({
            start: {
                x: active_segment.start.x,
                y: canvas.height() - active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: canvas.height() - active_segment.end.y
            }
        }, position);
        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: d.point.x, y: d.point.y,
            width: 5, height: 5
        });

        canvas.drawEllipse({
            fillStyle: '#ff0',
            layer: true,
            groups: ['projected'],
            x: active_segment.end.x,
            y: canvas.height() -active_segment.end.y,
            width: 5, height: 5
        });

        var distance = Math.sqrt(Math.pow(active_segment.end.x - d.point.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - d.point.y, 2));
        if (distance < 2) {
            window.active_segment_index += 1;
        }
    } else if (active_segment.configIntervalType === "ACI"){
        var angle = Math.PI -  Math.atan2((canvas.height() - active_segment.center.y) - position.y, active_segment.center.x - position.x);

        var dist_from_start = active_segment.arc_start - angle;
        var dist_from_end = (active_segment.arc_start + active_segment.delta) - angle;

        console.log('angle: ' + angle);
        console.log('start: ' + active_segment.arc_start + '(' + dist_from_start + ')');
        console.log('  end: ' + (active_segment.arc_start + active_segment.delta) + '(' + dist_from_end + ')');

        // if (corrigate_angle(angle) > Math.max(corrigate_angle(active_segment.arc_start), corrigate_angle(active_segment.arc_start + active_segment.delta))){
        //     if (dist_from_start < dist_from_end){
        //        angle = active_segment.arc_start;
        //     } else {
        //         angle = active_segment.arc_start + active_segment.delta;
        //     }
        // } else if (corrigate_angle(angle) < Math.min(corrigate_angle(active_segment.arc_start), corrigate_angle(active_segment.arc_start + active_segment.delta))) {
        //     if (dist_from_start < dist_from_end){
        //        angle = active_segment.arc_start;
        //     } else {
        //         angle = active_segment.arc_start + active_segment.delta;
        //     }
        // }

        var point_x = active_segment.center.x + active_segment.radius * Math.cos(angle);
        var point_y = (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(angle);
        var point_angle = Math.atan2(-(point_x - active_segment.center.x), (point_y - (canvas.height() - active_segment.center.y)));
        var angle_diff = point_angle - angle;

        canvas.drawLine({
                strokeStyle: '#0f0',
                strokeWidth: 1,
                layer: true,
                groups: ['projected'],
                endArrow: true,
                arrowRadius: 7,
                arrowAngle: 1,
                x1: point_x,
                y1: point_y,
                x2: point_x + 20 * Math.cos(point_angle),
                y2: point_y + 20 * Math.sin(point_angle)
            });

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: point_x,
            y: point_y,
            width: 5, height: 5
        });

        var s = active_segment.center.x + active_segment.radius * Math.cos(active_segment.arc_start + active_segment.delta);
        var e = (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(active_segment.arc_start + active_segment.delta);
        var distance = Math.sqrt(Math.pow(s - point_x, 2) + Math.pow(e - point_y, 2));

        if (distance < 2) {
            window.active_segment_index += 1;
        }
    }
}

function deta() {
    var canvas = $('canvas');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    var distance = Math.sqrt(Math.pow(active_segment.end.x - position.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - position.y, 2));
    if (distance < 15) {
        window.active_segment_index += 1;
    }
}
