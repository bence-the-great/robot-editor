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

$.extend($.jCanvas.defaults, {
    inDegrees: false
});
