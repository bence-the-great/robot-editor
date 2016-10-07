function setup_ros() {
    var ros = new ROSLIB.Ros({
        url: window.ros_url
    });

    ros.on('connection', function () {
        console.log('Connected to websocket server.');
    });

    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });

    window.publisher = new ROSLIB.Topic({
        ros: ros,
        name: window.ros_topic,
        messageType: 'std_msgs/String'
    });
}
