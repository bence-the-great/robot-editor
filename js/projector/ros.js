var listener;

function setup_ros(canvas) {
    var ros = new ROSLIB.Ros({
        url: window.ros_url
    });

    ros.on('connection', function () {
        console.log('Connected to websocket server.');
        path_listener = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.path.name,
            messageType: window.topics.path.message_type
        });

        path_listener.subscribe(function (message) {
            draw_segments(canvas, message.segments);
        });
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });

    listener = new ROSLIB.Topic({
        ros: ros,
        name: window.topics.scene.name,
        messageType: window.topics.scene.message_type
    });

    listener.subscribe(function (message) {
        console.log(message);

        canvas.removeLayers();
        canvas.attr('width', message.environment.field.width);
        canvas.attr('height', message.environment.field.height);
        canvas.drawLayers();

        for (var index in message.environment.obstacles) {
            draw_obstacle(canvas, message.environment.obstacles[index]);
        }
        draw_vehicle(canvas, message.robot, message.start, {
            stroke: '#444',
            fill: '#aaa'
        }, ['start']);
        draw_vehicle(canvas, message.robot, message.goal, {
            stroke: '#444',
            fill: '#aea'
        }, ['goal']);
    });
}

function draw_obstacle(canvas, polygon_points) {
    var obj = {
        strokeStyle: '#844',
        fillStyle: '#eaa',
        strokeWidth: 1,
        closed: true,
        layer: true
    };

    for (var p = 0; p < polygon_points.length; p += 1) {
        obj['x' + (p + 1)] = polygon_points[p].x;
        obj['y' + (p + 1)] = polygon_points[p].y;
    }
    canvas.drawLine(obj);
}

function draw_vehicle(canvas, robot_data, waypoint_data, style, groups) {
    console.log(robot_data);
    console.log(waypoint_data);

    var vehicle_body = {
        strokeStyle: style.stroke,
        fillStyle: style.fill,
        strokeWidth: 1,
        closed: true,
        layer: true,
        groups: groups,
        x: waypoint_data.x,
        y: waypoint_data.y,
        rotate: waypoint_data.phi
    };
    console.log(robot_data);
    for (var i = 0; i < robot_data.body.length; i += 1) {
        vehicle_body['x' + (i + 1)] = robot_data.body[i].x;
        vehicle_body['y' + (i + 1)] = robot_data.body[i].y;
    }
    console.log(vehicle_body);

    var axis = {
        strokeStyle: '#44f',
        strokeWidth: 2,
        layer: true,
        groups: groups,
        x: waypoint_data.x,
        y: waypoint_data.y,
        rotate: waypoint_data.phi,
        x1: 0,
        y1: -10,
        x2: 0,
        y2: 10
    };

    var forward_direction = {
        strokeStyle: '#f44',
        strokeWidth: 2,
        x: waypoint_data.x,
        y: waypoint_data.y,
        layer: true,
        endArrow: true,
        arrowRadius: 7,
        arrowAngle: 1,
        groups: groups,
        rotate: waypoint_data.phi,
        x1: 0,
        y1: 0,
        x2: 30,
        y2: 0
    };

    canvas.drawLine(vehicle_body);
    canvas.drawLine(axis);
    canvas.drawLine(forward_direction);
}
