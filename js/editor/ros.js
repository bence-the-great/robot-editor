function setup_ros(canvas) {
    window.ros = new ROSLIB.Ros({
        url: window.ros_url
    });

    ros.on('connection', function () {
        console.log('Connected to websocket server.');

        window.publisher = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.scene.name,
            messageType: window.topics.scene.message_type
        });

        path_listener = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.path.name,
            messageType: window.topics.path.message_type
        });

        path_listener.subscribe(function (message) {
            console.log('Path arrived');
            console.log(message);
            canvas.removeLayerGroup(window.groups.path);
            canvas.drawLayers();
            draw_segments(canvas, message.segments);
            window.path = message;
        });
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });
}
