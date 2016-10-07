function setup_ros(ros_url, ros_topic) {
    if (window.ros !== undefined){
        window.ros.close();
    }

    window.ros = new ROSLIB.Ros({
        url: ros_url
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
        name: ros_topic,
        messageType: 'std_msgs/String'
    });
}
