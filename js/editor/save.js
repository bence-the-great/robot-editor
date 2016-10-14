function setup_save() {
    $('#save-json-button').on('click', save_to_json);
}

function save_to_json() {
    var canvas = $('canvas');

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
        var obstacle_points = get_obstacle_points(obstacle);
        if (obstacle_points.length > 0) {
            environment.obstacles.push({points: obstacle_points});
        }
    }
    var start = canvas.getLayerGroup('start')[0];
    var goal = canvas.getLayerGroup('goal')[0];

    var scene = {
        robot: {
            minimumRadius: 44.2725882090055,
            wheelbase: 15.5000000000000,
            body: {
                points: [
                    {
                        x: 35.5,
                        y: 10.0
                    },
                    {
                        x: -4.5,
                        y: 10.0
                    },
                    {
                        x: -4.5,
                        y: -10.0
                    },
                    {
                        x: 35.5,
                        y: -10.0
                    }
                ]
            }

        },
        start: {
            x: start.x,
            y: start.y,
            phi: start.rotate
        },
        goal: {
            x: goal.x,
            y: goal.y,
            phi: goal.rotate
        },
        environment: environment
    };
    console.log(JSON.stringify(scene));
    window.publisher.publish(new ROSLIB.Message(scene));
}

function get_obstacle_points(obstacle) {
    var translate_x = obstacle['x'];
    var translate_y = obstacle['y'];
    var data = [];

    for (var i = 1; obstacle['x' + i] !== undefined && obstacle['y' + i] !== undefined; i++) {
        data.push({
            x: obstacle['x' + i] + translate_x,
            y: obstacle['y' + i] + translate_y
        });
    }

    return data;
}
