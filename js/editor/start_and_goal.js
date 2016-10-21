function setup_start_and_goal(canvas) {
    var start = {
        strokeStyle: '#444',
        fillStyle: '#aaa',
        groups: ['start'],
        position: {
            x: 10,
            y: 10,
            rotate: 0
        },
        vehicle_body: {
            x1: 35.5,
            y1: 10,
            x2: -4.5,
            y2: 10,
            x3: -4.5,
            y3: -10,
            x4: 35.5,
            y4: -10
        }
    };
    var goal = {
        strokeStyle: '#444',
        fillStyle: '#aea',
        groups: ['goal'],
        position: {
            x: 100,
            y: 100,
            rotate: 0
        },
        vehicle_body: {
            x1: 35.5,
            y1: 10,
            x2: -4.5,
            y2: 10,
            x3: -4.5,
            y3: -10,
            x4: 35.5,
            y4: -10
        }
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
        x1: 0,
        y1: -10,
        x2: 0,
        y2: 10
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
        x1: 0,
        y1: 0,
        x2: 30,
        y2: 0
    };

    canvas.drawLine(vehicle_body);
    canvas.drawLine(axis);
    canvas.drawLine(forward_direction);
}
