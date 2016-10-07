function setup_save() {
    $('#save-json-button').on('click', save_to_json);
}

function save_to_json() {
    var canvas = $('canvas');

    var environment = {
        type: 'environment',
        field: {
            width: parseInt(canvas.attr('width')),
            height: parseInt(canvas.attr('height'))
        },
        obstacles: []
    };
    var layers = canvas.getLayerGroup('obstacles');
    for (var layer = 0; layer < layers.length; layer++) {
        var object = layers[layer];
        var i = 1;
        var data = [];
        var xx = object['x'];
        var yy = object['y'];
        var x = object['x' + i];
        var y = object['y' + i];
        do {
            data.push({
                x: x + xx,
                y: y + yy
            });
            x = object['x' + i];
            y = object['y' + i];
            i++;
        } while (typeof x !== 'undefined' && typeof y !== 'undefined');
        environment.obstacles.push(data);
    }
    var start = canvas.getLayerGroup('start')[0];
    var goal = canvas.getLayerGroup('goal')[0];

    var scene = {
        type: 'scene',
        robot: {
            type: 'robot',
            minimumRadius: 44.2725882090055,
            wheelbase: 15.5000000000000,
            body: [
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
    window.publisher.publish(new ROSLIB.Message({data: JSON.stringify(scene)}));
}
