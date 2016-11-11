window.active_segment_index = 0;

function step() {
    var canvas = $('canvas');
    var es = canvas.getLayerGroup('start');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];

    position.x += robot.wheelbase * Math.cos(position.rotate);
    position.y += robot.wheelbase * Math.sin(position.rotate);

    if (active_segment === undefined){
        clearInterval(window.path_follower_interval);
        return false;
    }

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
        var projected_point = project_point_to_arc(canvas, position, active_segment);

        var center = {
            x: active_segment.center.x,
            y: canvas.height() - active_segment.center.y
        };

        var sign = active_segment.direction ? -1 : 1;
        sign *= Math.sign(Math.sqrt(distance_squared(position, center)) - active_segment.radius);

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: projected_point.x,
            y: projected_point.y,
            width: 5, height: 5
        });
        canvas.drawEllipse({
            fillStyle: '#ff0',
            layer: true,
            groups: ['projected'],
            x: position.x, y: position.y,
            width: 5, height: 5
        });

        var pos_error = sign * Math.sqrt(Math.pow(projected_point.x - position.x, 2) + Math.pow(projected_point.y - position.y, 2));
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
        var distance = Math.sqrt(Math.pow(s - projected_point.x, 2) + Math.pow(e - projected_point.y, 2));

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
            fillStyle: '#ff0',
            layer: true,
            groups: ['projected'],
            x: d.point.x, y: d.point.y,
            width: 5, height: 5
        });

        var distance = Math.sqrt(Math.pow(active_segment.end.x - d.point.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - d.point.y, 2));
        if (distance < 2) {
            window.active_segment_index += 1;
        }
    } else if (active_segment.configIntervalType === "ACI"){
        var correct_point = project_point_to_arc(canvas, position, active_segment);

        var center = {
            x: active_segment.center.x,
            y: canvas.height() - active_segment.center.y
        };

        var a = active_segment.direction ? 1 : -1;
        var sign = a * Math.sign(Math.sqrt(distance_squared(position, center)) - active_segment.radius);

        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#ff0',
            layer: true,
            groups: ['projected'],
            x: correct_point.x,
            y: correct_point.y,
            width: 5, height: 5
        });

        var s = active_segment.center.x + active_segment.radius * Math.cos(active_segment.arc_start + active_segment.delta);
        var e = (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(active_segment.arc_start + active_segment.delta);

        var distance = Math.sqrt(Math.pow(s - correct_point.x, 2) + Math.pow(e - correct_point.y, 2));
        if (distance < 2) {
            window.active_segment_index += 1;
        }
    }
}

function project_point_to_arc(canvas, position, segment){
    var angle = corrigate_angle2(Math.atan2((-position.y) - (-(canvas.height() - segment.center.y)), position.x - segment.center.x));
    var point = {
        x: segment.center.x + segment.radius * Math.cos(angle),
        y: (canvas.height() - segment.center.y) - segment.radius * Math.sin(angle)
    };
    var point_start = {
            x: segment.center.x + segment.radius * Math.cos(segment.arc_start),
            y: (canvas.height() - segment.center.y) - segment.radius * Math.sin(segment.arc_start)
        };
    var point_end = {
            x: segment.center.x + segment.radius * Math.cos(segment.arc_start + segment.delta),
            y: (canvas.height() - segment.center.y) - segment.radius * Math.sin(segment.arc_start + segment.delta)
        };
    var distance_from_start = corrigate_angle2(Math.atan2((-point.y) - (-(canvas.height() - segment.center.y)), point.x - segment.center.x) - segment.arc_start);

    var is_between = false;
    if (segment.direction) {  // ccw
        is_between = Math.abs(distance_from_start) <= Math.abs(segment.delta);
    } else {  // cw
        is_between = Math.abs(distance_from_start) >= (2 * Math.PI - Math.abs(segment.delta));
    }

    if (is_between) {
        return point;
    } else {
        if(segment.direction) {
            if (Math.abs((2 * Math.PI) - distance_from_start) < Math.abs(distance_from_start - segment.delta)){
                return point_start;
            } else {
                return point_end;
            }
        } else {
            if (Math.abs((2 * Math.PI) - distance_from_start) > Math.abs(distance_from_start - segment.delta)){
                return point_start;
            } else {
                return point_end;
            }
        }
    }
}
