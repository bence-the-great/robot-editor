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
}

function draw_arc(canvas, segment) {
    var start_theta = 1.57079633 - segment.arc_start;
    var delta_theta = segment.delta;
    console.log('start_theta: ' + start_theta + ' delta_theta: ' + delta_theta + ' dir: ' + segment.direction + ' orientation: ' + segment.orientation);

    var orientation = Math.abs(delta_theta) < Math.PI ? segment.orientation : !segment.orientation;
    var direction =   Math.abs(delta_theta) < Math.PI ? segment.direction : !segment.direction;
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

function draw_scene(canvas, scene) {
    for (var index in scene.environment.obstacles) {
        draw_obstacle(canvas, scene.environment.obstacles[index].points);
    }
    scene.start.phi *= -1;
    scene.start.y = canvas.height() - scene.start.y;
    draw_vehicle(canvas, scene.robot, scene.start, {
        stroke: '#444',
        fill: '#aaa'
    }, ['start', window.groups.scene]);
    scene.goal.phi *= -1;
    scene.goal.y = canvas.height() - scene.goal.y;
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
        obj['y' + (p + 1)] = canvas.height() - polygon_points[p].y;
    }
    canvas.drawLine(obj);
}

function draw_vehicle(canvas, robot_data, vehicle_data, style, groups) {
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

    for (var i = 0; i < robot_data.body.points.length; i += 1) {
        vehicle_body['x' + (i + 1)] = robot_data.body.points[i].x;
        vehicle_body['y' + (i + 1)] = robot_data.body.points[i].y;
    }

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
