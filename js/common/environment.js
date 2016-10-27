window.ros_url = 'ws://152.66.173.156:9090';
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

$.extend($.jCanvas.defaults, {
    inDegrees: false
});
