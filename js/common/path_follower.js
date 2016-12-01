window.states = [];
window.running = [];

function steps() {
    for (var i in window.running) {
        step(window.running[i]);
    }
}

function step(current_robot_index) {
    var canvas = $('canvas');
    var state = window.states[current_robot_index];
    var es = canvas.getLayerGroup(create_start_name(current_robot_index));
    var active_segment = get_active_segment(state);
    if (active_segment === undefined) {
        stop_following(current_robot_index);
        return false;
    }
    var reverse = active_segment.orientation ? 1 : -1;
    var position = get_line_sensor_position(canvas, current_robot_index, robot.wheelbase, reverse);

    canvas.removeLayerGroup(create_projected_name(state.robot_index));

    var v = is_robot_close_to_others(current_robot_index, reverse) ? 0 : 1.5;

    if (active_segment.configIntervalType === 'TCI') {
        var d = closest_point({
            start: {
                x: active_segment.start.x,
                y: active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: active_segment.end.y
            }
        }, position);


        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: [create_projected_name(state.robot_index)],
            x: d.point.x, y: d.point.y,
            width: 5, height: 5
        });
        canvas.drawEllipse({
            fillStyle: '#0f0',
            layer: true,
            groups: [create_projected_name(state.robot_index)],
            x: position.x, y: position.y,
            width: 5, height: 5
        });

        var pos_error = Math.sign(-d.angle_diff) * Math.sqrt(Math.pow(d.point.x - position.x, 2) + Math.pow(d.point.y - position.y, 2));
        var d_error = pos_error - state.last_error;
        state.last_error = pos_error;
        var pos_output = 0.1 * pos_error + 0.1 * d_error;
        var aggregated_output = Math.sign(pos_output) * Math.min(Math.abs(pos_output), 0.5);

        for (var index in es) {
            es[index].rotate += 0.5 * (v * Math.tan(aggregated_output) / window.robot.wheelbase);
            es[index].x += reverse * v * Math.cos(es[index].rotate);
            es[index].y += reverse * v * Math.sin(es[index].rotate);
            es[index].rotate += 0.5 * (v * Math.tan(aggregated_output) / window.robot.wheelbase);
        }
        canvas.drawLayers();

        var distance = Math.sqrt(Math.pow(active_segment.end.x - d.point.x, 2) + Math.pow(active_segment.end.y - d.point.y, 2));
        if (distance < 2) {
            determine_active_segment(state);
        }
    } else if (active_segment.configIntervalType === 'ACI') {
        var projected_point = project_point_to_arc(canvas, position, active_segment);

        var center = {
            x: active_segment.center.x,
            y: active_segment.center.y
        };

        var sign = active_segment.direction ? -1 : 1;
        sign *= Math.sign(Math.sqrt(distance_squared(position, center)) - active_segment.radius);


        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: [create_projected_name(state.robot_index)],
            x: projected_point.x,
            y: projected_point.y,
            width: 5, height: 5
        });
        canvas.drawEllipse({
            fillStyle: '#ff0',
            layer: true,
            groups: [create_projected_name(state.robot_index)],
            x: position.x, y: position.y,
            width: 5, height: 5
        });

        var pos_error = sign * Math.sqrt(Math.pow(projected_point.x - position.x, 2) + Math.pow(projected_point.y - position.y, 2));
        var d_error = pos_error - state.last_error;
        state.last_error = pos_error;
        var pos_output = 0.1 * pos_error + 0.1 * d_error;
        var aggregated_output = Math.sign(pos_output) * Math.min(Math.abs(pos_output), 0.7);

        var alpha = 0.9;
        state.filtered = alpha * state.filtered + (1 - alpha) * aggregated_output;

        for (var index in es) {
            es[index].rotate += 0.5 * (v * Math.tan(state.filtered) / window.robot.wheelbase);
            es[index].x += reverse * v * Math.cos(es[index].rotate);
            es[index].y += reverse * v * Math.sin(es[index].rotate);
            es[index].rotate += 0.5 * (v * Math.tan(state.filtered) / window.robot.wheelbase);
        }
        canvas.drawLayers();

        var s = active_segment.center.x + active_segment.radius * Math.cos(active_segment.arc_start + active_segment.delta);
        var e = active_segment.center.y - active_segment.radius * Math.sin(active_segment.arc_start + active_segment.delta);
        var distance = Math.sqrt(Math.pow(s - projected_point.x, 2) + Math.pow(e - projected_point.y, 2));

        if (distance < 2) {
            determine_active_segment(state);
        }
    } else {
        determine_active_segment(state);
    }
}

function drag_robot() {
    var current_robot_index = 0;
    var canvas = $('canvas');
    var state = window.states[current_robot_index];
    var position = get_line_sensor_position(canvas, current_robot_index, robot.wheelbase, 1);
    var others = [];
    for (var i=0; i<robot_count; i++) {
        if (i !== current_robot_index) {
            others.push(get_start_position(canvas, i));
        }
    }
    var angle = corrigate_angle2(-position.rotate);
    var allowed_distance = 200;

    canvas.removeLayerGroup(create_line_name(state.robot_index));

    canvas.drawLine({
        strokeStyle: '#ccc',
        fillStyle: '#ddd',
        strokeWidth: 1,
        opacity: 0.5,
        layer: true,
        groups: [create_line_name(state.robot_index)],
        x1: position.x + allowed_distance * Math.cos(-angle + 0.6),
        y1: position.y + allowed_distance * Math.sin(-angle + 0.6),
        x2: position.x,
        y2: position.y,
        x3: position.x + allowed_distance * Math.cos(-angle - 0.6),
        y3: position.y + allowed_distance * Math.sin(-angle - 0.6)
    });

    for (var i in others){
        var obj = others[i];
        for (var j = 1; j < 5; j++) {
            var other_position = {
                x:obj.x + obj['x'+j],
                y:obj.y + obj['y'+j]
            };
            var line_angle = corrigate_angle(corrigate_angle2(-Math.atan2(other_position.y-position.y, other_position.x-position.x)) - angle);
            console.log(corrigate_angle2(-Math.atan2(other_position.y-position.y, other_position.x-position.x)) + ' - ' + angle + ' = ' + line_angle);
            var is_close = Math.abs(line_angle) < 0.6 && Math.sqrt(distance_squared(other_position, position)) < allowed_distance;
            canvas.drawLine({
                strokeStyle: is_close ? '#4f4' : '#f44',
                strokeWidth: 1,
                layer: true,
                groups: [create_line_name(state.robot_index)],
                x1: position.x,
                y1: position.y,
                x2: obj.x + obj['x'+j],
                y2: obj.y + obj['y'+j]
            });
        }
    }

    canvas.drawLayers();
}

function project_point_to_arc(canvas, position, segment) {
    var angle = corrigate_angle2(Math.atan2((-position.y) - (-segment.center.y), position.x - segment.center.x));
    var point = {
        x: segment.center.x + segment.radius * Math.cos(angle),
        y: segment.center.y - segment.radius * Math.sin(angle)
    };
    var point_start = {
        x: segment.center.x + segment.radius * Math.cos(segment.arc_start),
        y: segment.center.y - segment.radius * Math.sin(segment.arc_start)
    };
    var point_end = {
        x: segment.center.x + segment.radius * Math.cos(segment.arc_start + segment.delta),
        y: segment.center.y - segment.radius * Math.sin(segment.arc_start + segment.delta)
    };
    var distance_from_start = corrigate_angle2(Math.atan2((-point.y) - (-segment.center.y), point.x - segment.center.x) - segment.arc_start);

    var is_between = false;
    if (segment.direction) {  // ccw
        is_between = Math.abs(distance_from_start) <= Math.abs(segment.delta);
    } else {  // cw
        is_between = Math.abs(distance_from_start) >= (2 * Math.PI - Math.abs(segment.delta));
    }

    if (is_between) {
        return point;
    } else {
        if (segment.direction) {
            if (Math.abs((2 * Math.PI) - distance_from_start) < Math.abs(distance_from_start - segment.delta)) {
                return point_start;
            } else {
                return point_end;
            }
        } else {
            if (Math.abs((2 * Math.PI) - distance_from_start) > Math.abs(distance_from_start - segment.delta)) {
                return point_start;
            } else {
                return point_end;
            }
        }
    }
}

function get_active_segment(state) {
    var active_segment = window.paths[state.robot_index].segments[state.active_segment_index];

    if (state.overrun_segment !== null) {
        if (active_segment.configIntervalType === 'TCI') {
            return construct_overrun_from_TCI(active_segment, state);
        } else {
            return construct_overrun_from_ACI(active_segment, state);
        }
    } else {
        return active_segment;
    }
}

function construct_overrun_from_TCI(segment, state) {
    canvas = $('canvas');
    var start = {x: segment.start.x, y: segment.start.y};
    var end = {x: segment.end.x, y: segment.end.y};
    var segment_vector = subtract(end, start);
    var line_angle = -1 * Math.atan2(segment_vector.y, segment_vector.x);

    var new_end = {
        x: segment.end.x + window.robot.wheelbase * Math.cos(line_angle),
        y: segment.end.y - window.robot.wheelbase * Math.sin(line_angle)
    };

    var segm = {
        configIntervalType: "TCI",
        arc_start: 0,
        delta: 0,
        direction: segment.direction,
        orientation: segment.orientation,
        radius: 0,
        center: {x: 0, y: 0},
        start: end,
        end: new_end
    };

    canvas.removeLayerGroup(create_segment_name(state.robot_index));
    canvas.drawLine({
        strokeStyle: '#f44',
        strokeWidth: 1,
        layer: true,
        endArrow: true,
        arrowRadius: 7,
        arrowAngle: 1,
        groups: [create_segment_name(state.robot_index)],
        x1: segm.start.x,
        y1: segm.start.y,
        x2: segm.end.x,
        y2: segm.end.y
    });
    canvas.drawLayers();

    return segm;
}

function construct_overrun_from_ACI(segment, state) {
    var multiplier = segment.direction ? -1 : 1;
    var a = multiplier * (segment.arc_start + segment.delta);
    var end_point = {
        x: segment.center.x + segment.radius * Math.cos(a),
        y: segment.center.y - multiplier *  segment.radius * Math.sin(a)
    };
    var center = {
        x: segment.center.x,
        y: segment.center.y,
    };
    var diff = segment.direction ? subtract(end_point, center) : subtract(center, end_point);
    var line_angle = Math.atan2(-diff.x, diff.y);

    var new_end = {
        x: end_point.x + window.robot.wheelbase * Math.cos(-line_angle),
        y: end_point.y - window.robot.wheelbase * Math.sin(-line_angle)
    };

    var segm = {
        configIntervalType: "TCI",
        arc_start: 0,
        delta: 0,
        direction: segment.direction,
        orientation: segment.orientation,
        radius: 0,
        center: {x: 0, y: 0},
        start: end_point,
        end: new_end
    };

    canvas.removeLayerGroup(create_segment_name(state.robot_index));
    canvas.drawLine({
        strokeStyle: '#f44',
        strokeWidth: 1,
        layer: true,
        endArrow: true,
        arrowRadius: 7,
        arrowAngle: 1,
        groups: [create_segment_name(state.robot_index)],
        x1: segm.start.x,
        y1: segm.start.y,
        x2: segm.end.x,
        y2: segm.end.y
    });
    canvas.drawLayers();

    return segm;
}

function determine_active_segment(state) {
    state.last_error = null;

    if (state.overrun_segment !== null) {
        state.overrun_segment = null;
        state.active_segment_index += 1;
    } else {
        var next_index = state.active_segment_index + 1;

        if (window.paths[state.robot_index].segments.length <= next_index) {
            state.overrun_segment = state.active_segment_index;
        } else if (window.paths[state.robot_index].segments[next_index].orientation !== window.paths[state.robot_index].segments[state.active_segment_index].orientation) {
            state.overrun_segment = state.active_segment_index;
        } else {
            state.active_segment_index += 1;
        }
    }
}

function start_following() {
    reset_state();
    window.path_follower_interval = setInterval(steps, 30);
    $('#start-button').unbind('click').on('click', stop_all).text('Stop');
}

function stop_following(robot_index) {
    var index = window.running.indexOf(robot_index);
    if (index > -1) {
        window.running.splice(index, 1);
    }
    if (window.running.length <= 0) {
        clearInterval(window.path_follower_interval);
        $('#start-button').unbind('click').on('click', start_following).text('Start');
    }
}

function stop_all(){
    window.running = [];
    clearInterval(window.path_follower_interval);
    $('#start-button').unbind('click').on('click', start_following).text('Start');
}

function reset_state() {
    window.states = [];
    for (var i = 0; i < robot_count; i++) {
        window.states[i] = {
            robot_index: i,
            active_segment_index: 0,
            overrun_segment: null,
            last_error: null,
            filtered: 0
        };
        window.running.push(i);
    }
}

function is_robot_close_to_others(robot_index, reverse){
    var canvas = $('canvas');
    var allowed_distance = 150;
    var position = get_line_sensor_position(canvas, robot_index, robot.wheelbase, reverse);
    var angle = corrigate_angle2(-position.rotate - Math.PI/2 + (Math.PI/2) * reverse);
    var others = [];
    for (var i=0; i<robot_count; i++) {
        if (i !== robot_index) {
            others.push(get_start_position(canvas, i));
        }
    }

    canvas.removeLayerGroup(create_line_name(robot_index));

    for (var i in others){
        var obj = others[i];
        for (var j = 1; j < 5; j++) {
            var other_position = {
                x:obj.x + Math.cos(obj.rotate) * obj['x'+j] - Math.sin(obj.rotate) * obj['y'+j],
                y:obj.y + Math.sin(obj.rotate) * obj['x'+j] + Math.cos(obj.rotate) * obj['y'+j]
            };
            var line_angle = corrigate_angle(corrigate_angle2(-Math.atan2(other_position.y-position.y, other_position.x-position.x)) - angle);
            var is_close = Math.abs(line_angle) < 0.6 && Math.sqrt(distance_squared(other_position, position)) < allowed_distance;

            canvas.drawLine({
                strokeStyle: is_close ? '#f44' : '#4f4',
                strokeWidth: 1,
                layer: true,
                groups: [create_line_name(robot_index)],
                x1: position.x,
                y1: position.y,
                x2: other_position.x,
                y2: other_position.y
            });

            if (is_close) {
                return true;
            }
        }
    }
    return false;
}
