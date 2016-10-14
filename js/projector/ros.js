var listener;

function setup_ros(canvas) {
    var ros = new ROSLIB.Ros({
        url: window.ros_url
    });

    ros.on('connection', function () {
        console.log('Connected to websocket server.');
        path_listener = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.path.name,
            messageType: window.topics.path.message_type
        });

        listener = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.scene.name,
            messageType: window.topics.scene.message_type
        });

        path_listener.subscribe(function (message) {
            canvas.removeLayerGroup(window.groups.path);
            canvas.drawLayers();
            draw_segments(canvas, message.segments);
        });

        listener.subscribe(function (message) {
            canvas.removeLayerGroup(window.groups.scene);
            canvas.attr('width', message.environment.field.width);
            canvas.attr('height', message.environment.field.height);
            canvas.drawLayers();

            draw_scene(canvas, message);
        });
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });
}
