window.ros_url = 'ws://152.66.175.233:9090';
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
    body: {
        x1: 35.5,
        y1: 10,
        x2: -4.5,
        y2: 10,
        x3: -4.5,
        y3: -10,
        x4: 35.5,
        y4: -10
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
