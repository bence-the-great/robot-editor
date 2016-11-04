function setup_save() {
    $('#save-json-button').on('click', save_to_json);
}

function save_to_json() {
    var canvas = $('canvas');
    var height = canvas.height();

    var environment = {
        field: {
            width: parseInt(canvas.attr('width')),
            height: parseInt(canvas.attr('height'))
        },
        obstacles: []
    };
    var layers = canvas.getLayerGroup('obstacles');
    for (var layer in layers) {
        var obstacle = layers[layer];
        var obstacle_points = get_obstacle_points(obstacle, canvas);
        if (obstacle_points.length > 0) {
            environment.obstacles.push({points: obstacle_points});
        }
    }
    var start = canvas.getLayerGroup('start')[0];
    var goal = canvas.getLayerGroup('goal')[0];

    var scene = {
        robot: {
            minimumRadius: 75,
            wheelbase: 26.5,
            body: {
                points: [
                    {
                        "x": -5.25,
                        "y": -17.5
                    },
                    {
                        "x": 36.25,
                        "y": -17.5
                    },
                    {
                        "x": 36.25,
                        "y": 17.5
                    },
                    {
                        "x": -5.25,
                        "y": 17.5
                    }
                ]
            }

        },
        start: {
            x: start.x,
            y: height - start.y,
            phi: start.rotate * -1
        },
        goal: {
            x: goal.x,
            y: height - goal.y,
            phi: goal.rotate * -1
        },
        environment: environment
    };
    console.log(JSON.stringify(scene));
    window.publisher.publish(new ROSLIB.Message(scene));
}

function get_obstacle_points(obstacle, canvas) {
    var translate_x = obstacle['x'];
    var translate_y = obstacle['y'];
    var data = [];

    for (var i = 1; obstacle['x' + i] !== undefined && obstacle['y' + i] !== undefined; i++) {
        data.push({
            x: obstacle['x' + i] + translate_x,
            y: canvas.height() - (obstacle['y' + i] + translate_y)
        });
    }

    return data;
}
