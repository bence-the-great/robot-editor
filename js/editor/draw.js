var drawing = false;
var polygon_points = [];

function setup_drawing(canvas) {
    $('#draw-polygon-button').on('click', function () {
        drawing = !drawing;
        if (drawing == true) {
            $(this).text('Stop drawing');
        } else {
            $('canvas').removeLayerGroup('wip');
            var obj = {
                strokeStyle: '#844',
                fillStyle: '#eaa',
                strokeWidth: 1,
                closed: true,
                draggable: true,
                groups: ['obstacles'],
                cursors: {
                    mouseover: 'pointer',
                    mousedown: 'move',
                    mouseup: 'pointer'
                },
                dblclick: function (layer) {
                    canvas.removeLayer(layer.index);
                    canvas.drawLayers();
                }
            };
            for (var p = 0; p < polygon_points.length; p += 1) {
                obj['x' + (p + 1)] = polygon_points[p][0];
                obj['y' + (p + 1)] = polygon_points[p][1];
            }
            canvas.drawLine(obj);
            polygon_points = [];
            $(this).text('Draw polygon');
        }
    });

    canvas.on('mouseup', function (e) {
        var position = canvas.offset();
        var x = e.pageX - position.left;
        var y = e.pageY - position.top;
        if (drawing) {
            polygon_points.push([x, y]);
            $('canvas').removeLayerGroup('wip');
            var obj = {
                strokeStyle: '#a44',
                strokeWidth: 1,
                layer: true,
                groups: ['wip']
            };
            for (var p = 0; p < polygon_points.length; p += 1) {
                obj['x' + (p + 1)] = polygon_points[p][0];
                obj['y' + (p + 1)] = polygon_points[p][1];
                canvas.drawEllipse({
                    fillStyle: '#c33',
                    layer: true,
                    groups: ['wip'],
                    x: polygon_points[p][0], y: polygon_points[p][1],
                    width: 10, height: 10
                });
            }
            canvas.drawLine(obj);
        }
    });
}

function load_scene(canvas, scene_data) {
    var scene = JSON.parse(scene_data);
    var environment = scene.environment;
    canvas.removeLayerGroup('obstacles');
    canvas.removeLayerGroup('start');
    canvas.removeLayerGroup('goal');

    canvas.attr('width', environment.field.width);
    canvas.attr('height', environment.field.height);

    var start = {
        strokeStyle: '#444',
        fillStyle: '#aaa',
        groups: ['start'],
        position: {
            x: scene.start.x,
            y: canvas.height() - scene.start.y,
            rotate: scene.start.phi
        },
        vehicle_body: scene.robot.body
    };
    var goal = {
        strokeStyle: '#444',
        fillStyle: '#aea',
        groups: ['goal'],
        position: {
            x: scene.goal.x,
            y: canvas.height() - scene.goal.y,
            rotate: scene.goal.phi
        },
        vehicle_body: window.robot.body
    };

    vehicle(canvas, start, $('input#id-start-rotation'));
    vehicle(canvas, goal, $('input#id-goal-rotation'));

    for (index in environment.obstacles) {
        var obstacle = environment.obstacles[index];
        var obj = {
            strokeStyle: '#844',
            fillStyle: '#eaa',
            strokeWidth: 1,
            closed: true,
            draggable: true,
            groups: ['obstacles'],
            cursors: {
                mouseover: 'pointer',
                mousedown: 'move',
                mouseup: 'pointer'
            },
            dblclick: function (layer) {
                canvas.removeLayer(layer.index);
                canvas.drawLayers();
            }
        };
        for (var p = 0; p < obstacle.points.length; p += 1) {
            obj['x' + (p + 1)] = obstacle.points[p].x;
            obj['y' + (p + 1)] = canvas.height() - obstacle.points[p].y;
        }
        canvas.drawLine(obj);
    }
    canvas.drawLayers();
}
