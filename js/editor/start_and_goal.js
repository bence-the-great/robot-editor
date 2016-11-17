function setup_start_and_goal(canvas) {
    var start = {
        strokeStyle: '#444',
        fillStyle: '#aaa',
        groups: ['start'],
        position: {
            x: 62,
            y: 170,
            rotate: 0
        },
        vehicle_body: window.robot.body
    };
    var goal = {
        strokeStyle: '#444',
        fillStyle: '#aea',
        groups: ['goal'],
        position: {
            x: 50,
            y: 120,
            rotate: 0
        },
        vehicle_body: window.robot.body
    };
    vehicle(canvas, start, $('input#id-start-rotation'));
    vehicle(canvas, goal, $('input#id-goal-rotation'));
    $('input[name=start-rotation]').on('change', function (e) {
        var rotate = $(this).val() * -1;
        var layer_group = canvas.getLayerGroup('start');
        for (var i = 0; i < layer_group.length; i++) {
            layer_group[i].rotate = parseFloat(rotate);
        }
        canvas.drawLayers();
    });

    $('input[name=goal-rotation]').on('change', function (e) {
        var rotate = $(this).val() * -1;
        var layer_group = canvas.getLayerGroup('goal');
        for (var i = 0; i < layer_group.length; i++) {
            layer_group[i].rotate = parseFloat(rotate);
        }
        canvas.drawLayers();
    });
}

function vehicle(canvas, waypoint_data, rotation_input) {
    var vehicle_body = {
        strokeStyle: waypoint_data.strokeStyle,
        fillStyle: waypoint_data.fillStyle,
        strokeWidth: 1,
        closed: true,
        draggable: true,
        cursors: {
            mouseover: 'pointer',
            mousedown: 'move',
            mouseup: 'pointer'
        },
        drag: function (){
            highlight_closest_point();
        },
        mousedown: function (){
            rotation_input.focus();
        },
        groups: waypoint_data.groups,
        dragGroups: waypoint_data.groups,
        x: waypoint_data.position.x,
        y: waypoint_data.position.y,
        rotate: waypoint_data.position.rotate
    };

    for (var key in waypoint_data.vehicle_body) {
        vehicle_body[key] = waypoint_data.vehicle_body[key];
    }

    var axis = {
        strokeStyle: '#44f',
        strokeWidth: 2,
        draggable: true,
        cursors: {
            mouseover: 'pointer',
            mousedown: 'move',
            mouseup: 'pointer'
        },
        mousedown: function (){
            rotation_input.focus();
        },
        groups: waypoint_data.groups,
        dragGroups: waypoint_data.groups,
        x: waypoint_data.position.x,
        y: waypoint_data.position.y,
        rotate: waypoint_data.position.rotate,
        x1: window.robot.axis.x1,
        y1: window.robot.axis.y1,
        x2: window.robot.axis.x2,
        y2: window.robot.axis.y2
    };

    var forward_direction = {
        strokeStyle: '#f44',
        strokeWidth: 2,
        draggable: true,
        endArrow: true,
        arrowRadius: 7,
        arrowAngle: 1,
        cursors: {
            mouseover: 'pointer',
            mousedown: 'move',
            mouseup: 'pointer'
        },
        mousedown: function (){
            rotation_input.focus();
        },
        groups: waypoint_data.groups,
        dragGroups: waypoint_data.groups,
        x: waypoint_data.position.x,
        y: waypoint_data.position.y,
        rotate: waypoint_data.position.rotate,
        x1: window.robot.forward_direction.x1,
        y1: window.robot.forward_direction.y1,
        x2: window.robot.forward_direction.x2,
        y2: window.robot.forward_direction.y2
    };

    canvas.drawLine(vehicle_body);
    canvas.drawLine(axis);
    canvas.drawLine(forward_direction);
}

function get_start_position(canvas) {
    var obj = canvas.getLayerGroup('start')[0];
    return {
        x: obj.x + Math.random() * 2 - 1,
        y: obj.y + Math.random() * 2 - 1,
        rotate: obj.rotate
    };
}
