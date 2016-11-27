window.paths = [];

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
            console.log(message);
            draw_segments(canvas, message.segments, window.paths.length);
            window.paths.push(message);
            transform_ys(window.paths[window.paths.length - 1]);
            if (window.paths.length < robot_count) {
                publish_scene(window.paths.length);
            }
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
