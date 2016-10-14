function setup_ros(ros_url) {
    var rosbridge_url_input = $('input.rosbridge-url');
    rosbridge_url_input.css('background', 'yellow');
    if (window.ros !== undefined) {
        window.ros.close();
    }

    window.ros = new ROSLIB.Ros({
        url: ros_url
    });

    ros.on('connection', function () {
        console.log('Connected to websocket server.');

        window.publisher = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.scene.name,
            messageType: window.topics.scene.message_type
        });
        window.path_publisher = new ROSLIB.Topic({
            ros: ros,
            name: window.topics.path.name,
            messageType: window.topics.path.message_type
        });
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });
}
