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
            } else {
                draw_intersections();
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

function draw_intersections(){
    var canvas = $('canvas');
    var intersections = [];

    for (var i = 0; i < window.paths.length; i++) {
        for (var j = i + 1; j < window.paths.length; j++) {
            var path1 = window.paths[i];
            var path2 = window.paths[j];
            for(var segment_i1=0; segment_i1<path1.segments.length; segment_i1++){
                for(var segment_i2=0; segment_i2<path2.segments.length; segment_i2++){
                    var segment1 = path1.segments[segment_i1];
                    var segment2 = path2.segments[segment_i2];
                    if(segment1.configIntervalType === 'TCI' && segment2.configIntervalType === 'TCI'){
                        var line_line_result = line_line(canvas, segment1, segment2);
                        if (line_line_result !== null){
                            line_line_result.a = 'line line';
                            line_line_result.segment1 = segment1;
                            line_line_result.segment2 = segment2;
                            intersections.push(line_line_result);
                        }
                        if (line_line_result !== null) {
                            canvas.drawEllipse({
                                fillStyle: '#ff0',
                                opacity: 0.5,
                                layer: true,
                                x: line_line_result.x,
                                y: line_line_result.y,
                                width: 100, height: 100
                            });
                        }
                    } else if (segment1.configIntervalType === 'ACI' && segment2.configIntervalType === 'ACI') {
                        var results = circle_circle(canvas, segment1, segment2);
                        if (results.length > 0){
                            results.push('cc', segment1, segment2);
                            intersections.push(results);
                        }
                        for (var result_i in results) {
                            var result = results[result_i];
                            canvas.drawEllipse({
                                fillStyle: '#ff0',
                                opacity: 0.5,
                                layer: true,
                                x: result.x,
                                y: result.y,
                                width: 100, height: 100
                            });
                        }
                    } else if (segment1.configIntervalType === 'TCI' && segment2.configIntervalType === 'ACI') {
                        var results = line_circle(canvas, segment1, segment2);
                        if (results.length > 0){
                            results.push('lc', segment1, segment2);
                            intersections.push(results);
                        }
                        for (var result_i in results) {
                            var result = results[result_i];
                            canvas.drawEllipse({
                                fillStyle: '#ff0',
                                opacity: 0.5,
                                layer: true,
                                x: result.x,
                                y: result.y,
                                width: 100, height: 100
                            });
                        }
                    } else {
                        var results = line_circle(canvas, segment2, segment1);
                        if (results.length > 0){
                            results.push('cl', segment2, segment1);
                            intersections.push(results);
                        }
                        for (var result_i in results) {
                            var result = results[result_i];
                            canvas.drawEllipse({
                                fillStyle: '#ff0',
                                opacity: 0.5,
                                layer: true,
                                x: result.x,
                                y: result.y,
                                width: 100, height: 100
                            });
                        }
                    }
                }
            }
        }
    }
    console.log(intersections);
}

function transform_ys(path){
    for (var index in path.segments){
        var segment = path.segments[index];
        transform_y_coordinate(segment.start);
        transform_y_coordinate(segment.end);
        transform_y_coordinate(segment.center);
    }
}
