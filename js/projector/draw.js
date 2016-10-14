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
        groups: [window.groups.path],
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
        groups: [window.groups.path],
        start: segment.arc_start,
        end: segment.arc_start + segment.delta
    });
}

function draw_scene(canvas, scene) {
    for (var index in scene.environment.obstacles) {
        draw_obstacle(canvas, scene.environment.obstacles[index].points);
    }
    draw_vehicle(canvas, scene.robot, scene.start, {
        stroke: '#444',
        fill: '#aaa'
    }, ['start', window.groups.scene]);
    draw_vehicle(canvas, scene.robot, scene.goal, {
        stroke: '#444',
        fill: '#aea'
    }, ['goal', window.groups.scene]);
}

function draw_obstacle(canvas, polygon_points) {
    var obj = {
        strokeStyle: '#844',
        fillStyle: '#eaa',
        strokeWidth: 1,
        closed: true,
        layer: true,
        groups: [window.groups.scene]
    };

    for (var p = 0; p < polygon_points.length; p += 1) {
        obj['x' + (p + 1)] = polygon_points[p].x;
        obj['y' + (p + 1)] = polygon_points[p].y;
    }
    canvas.drawLine(obj);
}

function draw_vehicle(canvas, robot_data, vehicle_data, style, groups) {
    console.log(robot_data);
    console.log(vehicle_data);

    var vehicle_body = {
        strokeStyle: style.stroke,
        fillStyle: style.fill,
        strokeWidth: 1,
        closed: true,
        layer: true,
        groups: groups,
        x: vehicle_data.x,
        y: vehicle_data.y,
        rotate: vehicle_data.phi
    };
    console.log(robot_data);
    for (var i = 0; i < robot_data.body.points.length; i += 1) {
        vehicle_body['x' + (i + 1)] = robot_data.body.points[i].x;
        vehicle_body['y' + (i + 1)] = robot_data.body.points[i].y;
    }
    console.log(vehicle_body);

    var axis = {
        strokeStyle: '#44f',
        strokeWidth: 2,
        layer: true,
        groups: groups,
        x: vehicle_data.x,
        y: vehicle_data.y,
        rotate: vehicle_data.phi,
        x1: 0,
        y1: -10,
        x2: 0,
        y2: 10
    };

    var forward_direction = {
        strokeStyle: '#f44',
        strokeWidth: 2,
        x: vehicle_data.x,
        y: vehicle_data.y,
        layer: true,
        endArrow: true,
        arrowRadius: 7,
        arrowAngle: 1,
        groups: groups,
        rotate: vehicle_data.phi,
        x1: 0,
        y1: 0,
        x2: 30,
        y2: 0
    };

    canvas.drawLine(vehicle_body);
    canvas.drawLine(axis);
    canvas.drawLine(forward_direction);
}
