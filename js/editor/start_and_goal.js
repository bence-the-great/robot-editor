var selected_robot_index = 0;
var robot_count = 0;

function add_start_and_goal(canvas, robot_index) {
    var start = {
        strokeStyle: '#444',
        fillStyle: '#aaa',
        groups: [create_start_name(robot_index)],
        position: {
            x: 182,
            y: 200,
            rotate: 0
        },
        vehicle_body: window.robot.body
    };
    var goal = {
        strokeStyle: '#444',
        fillStyle: '#aea',
        groups: [create_goal_name(robot_index)],
        position: {
            x: 50,
            y: 120,
            rotate: 0
        },
        vehicle_body: window.robot.body
    };
    vehicle(canvas, start, $('input#id-start-rotation'), robot_index);
    vehicle(canvas, goal, $('input#id-goal-rotation'), robot_index);
    robot_count += 1;
}

function vehicle(canvas, waypoint_data, rotation_input, robot_index) {
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
            drag_robot();
        },
        mousedown: function (){
            selected_robot_index = robot_index;
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
        strokeStyle: '#444',
        strokeWidth: 2,
        draggable: true,
        cursors: {
            mouseover: 'pointer',
            mousedown: 'move',
            mouseup: 'pointer'
        },
        mousedown: function (){
            selected_robot_index = robot_index;
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
        strokeStyle: '#444',
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
            selected_robot_index = robot_index;
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
    $('canvas').drawText({
        strokeStyle: '#ff6',
        strokeWidth: 1,
        groups: waypoint_data.groups,
        dragGroups: waypoint_data.groups,
        x: waypoint_data.position.x,
        y: waypoint_data.position.y,
        fontSize: 9,
        fontFamily: 'Roboto, sans-serif',
        text: robot_index,
        rotate: waypoint_data.position.rotate,
    });
}

function get_start_position(canvas, robot_index) {
    var obj = canvas.getLayerGroup(create_start_name(robot_index))[0];
    return {
        x: obj.x + Math.random() * 2 - 1,
        y: obj.y + Math.random() * 2 - 1,
        x1: obj.x1,
        y1: obj.y1,
        x2: obj.x2,
        y2: obj.y2,
        x3: obj.x3,
        y3: obj.y3,
        x4: obj.x4,
        y4: obj.y4,
        rotate: obj.rotate
    };
}

function create_start_name(index){
    return create_name('start', index);
}

function create_goal_name(index){
    return create_name('goal', index);
}

function create_path_name(index){
    return create_name('path', index);
}

function create_projected_name(index) {
    return create_name('projected', index);
}

function create_segment_name(index) {
    return create_name('segm', index);
}

function create_line_name(index) {
    return create_name('line', index);
}

function create_name(prefix, index){
    return prefix + index;
}
