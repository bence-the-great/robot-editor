window.active_segment_index = 0;

function step() {
    var canvas = $('canvas');
    var es = canvas.getLayerGroup('start');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    if (active_segment.configIntervalType === 'TCI') {
        position.x += robot.wheelbase * Math.cos(position.rotate);
        position.y += robot.wheelbase * Math.sin(position.rotate);

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

        // var angle_error = Math.atan2(active_segment.end.y - active_segment.start.y, active_segment.end.x - active_segment.start.x) - position.rotate;
        // var angle_output = 0.2 * angle_error;

        var pos_error = Math.sign(d.angle_diff) * Math.sqrt(Math.pow(d.point.x - position.x, 2) + Math.pow(d.point.y - position.y, 2));
        console.log('error: ' + pos_error);
        var pos_output = 0.03 * pos_error;
        var aggregated_output = pos_output;

        for (var index in es) {
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
            es[index].x += 1.5 * Math.cos(es[index].rotate);
            es[index].y += 1.5 * Math.sin(es[index].rotate);
            es[index].rotate += 0.5 * (1.5 * Math.tan(aggregated_output) / window.robot.wheelbase);
        }
        canvas.drawLayers();

        var distance = Math.sqrt(Math.pow(active_segment.end.x - position.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - position.y, 2));
        if (distance < 5) {
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
    } else if (active_segment.configIntervalType === "ACI"){
        var angle = Math.PI -  Math.atan2((canvas.height() - active_segment.center.y) - position.y, active_segment.center.x - position.x);

        var dist_from_start = Math.abs(corrigate_angle(Math.abs(angle - active_segment.arc_start)));
        var dist_from_end = Math.abs(corrigate_angle(Math.abs(angle - (active_segment.arc_start + active_segment.delta))));

        if (angle > Math.max(active_segment.arc_start, active_segment.arc_start + active_segment.delta)){
            if (dist_from_start < dist_from_end){
               angle = active_segment.arc_start;
            } else {
                angle = active_segment.arc_start + active_segment.delta;
            }
        } else if (angle < Math.min(active_segment.arc_start, active_segment.arc_start + active_segment.delta)) {
            if (dist_from_start < dist_from_end){
               angle = active_segment.arc_start;
            } else {
                angle = active_segment.arc_start + active_segment.delta;
            }
        }

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: active_segment.center.x + active_segment.radius * Math.cos(angle),
            y: (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(angle),
            width: 5, height: 5
        });
    }
}

function deta() {
    var canvas = $('canvas');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    var distance = Math.sqrt(Math.pow(active_segment.end.x - position.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - position.y, 2));
    if (distance < 5) {
        window.active_segment_index += 1;
    }
}
