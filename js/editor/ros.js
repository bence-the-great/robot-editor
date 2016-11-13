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
            // TODO transform y coordinates
            window.path = message;
            transform_ys(window.path)
        });
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });
}

function transform_ys(path){
    for (var index in path.segments){
        var segment = path.segments[index];
        transform_y_coordinate(segment.start);
        transform_y_coordinate(segment.end);
        transform_y_coordinate(segment.center);
    }
}
