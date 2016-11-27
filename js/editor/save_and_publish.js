function setup_save() {
    $('#publish-button').on('click', function(){
        window.paths = [];
        for (var i = 0; i < robot_count; i++) {
            canvas.removeLayerGroup(create_path_name(i));
            canvas.drawLayers();
        }
        publish_scene(0);
    });
    $('#save-button').on('click', save_scene);
}

function setup_load() {
    $('#load-button').on('click', function () {
        var scene_json = $('input[name=scene]').val();
        load_scene($('canvas'), scene_json);
    });
}

function save_scene() {
    var canvas = $('canvas');
    var scene = get_scene(canvas);
    scene.configs = [];
    for (var index = 0; index < robot_count; index++) {
        var start = canvas.getLayerGroup(create_start_name(index))[0];
        var goal = canvas.getLayerGroup(create_goal_name(index))[0];

        scene.configs.push({
            index: index,
            start: {
                x: start.x,
                y: canvas.height() - start.y,
                phi: start.rotate * -1
            },
            goal: {
                x: goal.x,
                y: canvas.height() - goal.y,
                phi: goal.rotate * -1
            }
        });
    }
    $('input[name=scene]').val(JSON.stringify(scene));
}

function publish_scene(index) {
    var canvas = $('canvas');
    var start = canvas.getLayerGroup(create_start_name(index))[0];
    var goal = canvas.getLayerGroup(create_goal_name(index))[0];
    var scene = get_scene(canvas);
    scene.start = {
        x: start.x,
        y: canvas.height() - start.y,
        phi: start.rotate * -1
    };
    scene.goal = {
        x: goal.x,
        y: canvas.height() - goal.y,
        phi: goal.rotate * -1
    };
    window.publisher.publish(new ROSLIB.Message(scene));
}

function get_scene(canvas) {
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
        environment: environment
    };
    return scene;
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
