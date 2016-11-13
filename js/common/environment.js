window.ros_url = 'ws://192.168.1.71:9090';
window.topics = {
    scene: {
        name: '/scene',
        message_type: 'robot_editor/Scene'
    },
    path: {
        name: '/path',
        message_type: 'robot_editor/Path'
    }
};
window.groups = {
    path: 'path',
    scene: 'scene'
};

window.robot = {
    minimumRadius: 75,
    wheelbase: 26.5,
    body: {
        x1: -5.25,
        y1: -17.5,
        x2: 36.25,
        y2: -17.5,
        x3: 36.25,
        y3: 17.5,
        x4: -5.25,
        y4: 17.5
    },
    axis: {
        x1: 0,
        y1: -10,
        x2: 0,
        y2: 10
    },
    forward_direction: {
        x1: 0,
        y1: 0,
        x2: 30,
        y2: 0
    }
};

$.extend($.jCanvas.defaults, {
    inDegrees: false
});
