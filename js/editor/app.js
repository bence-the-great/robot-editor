$(function () {
    var canvas = $('canvas');
    window.canvas = canvas;
    add_start_and_goal(canvas, robot_count);
    setup_save(canvas);
    setup_load(canvas);
    setup_drawing(canvas);
    setup_ros(canvas);

    $('input[name=canvas-width]').on('change', function (e) {
        var width = parseInt($(this).val());
        canvas.attr('width', width);
        canvas.drawLayers();
    });

    $('input[name=canvas-height]').on('change', function (e) {
        var height = parseInt($(this).val());
        canvas.attr('height', height);
        canvas.drawLayers();
    });

    $('#start-button').on('click', start_following);

    $('input[name=start-rotation]').on('change', function (e) {
        var rotate = $(this).val() * -1;
        var layer_group = canvas.getLayerGroup('start' + selected_robot_index);
        for (var i = 0; i < layer_group.length; i++) {
            layer_group[i].rotate = parseFloat(rotate);
        }
        canvas.drawLayers();
    });

    $('input[name=goal-rotation]').on('change', function (e) {
        var rotate = $(this).val() * -1;
        var layer_group = canvas.getLayerGroup('goal' + selected_robot_index);
        for (var i = 0; i < layer_group.length; i++) {
            layer_group[i].rotate = parseFloat(rotate);
        }
        canvas.drawLayers();
    });

    $('#add-robot-button').on('click', function (e) {
        add_start_and_goal(canvas, robot_count);
    });

    // line_line(canvas);
    // line_circle(canvas);
    // circle_circle(canvas);

});

function circle_circle(canvas){
    var circle1 = {
        x: 750,
        y: 400,
        radius: 50
    };
    var circle2 = {
        x: 800,
        y: 450,
        radius: 95
    };
    canvas.drawEllipse({
        strokeStyle: '#000',
        layer: true,
        x: circle1.x,
        y: circle1.y,
        width: circle1.radius*2, height: circle1.radius*2
    });
    canvas.drawEllipse({
        strokeStyle: '#000',
        layer: true,
        x: circle2.x,
        y: circle2.y,
        width: circle2.radius*2, height: circle2.radius*2
    });

    var d = Math.sqrt(distance_squared(circle1, circle2));

    console.log(d + ' || ' + (circle1.radius + circle2.radius));

    /* Check for solvability. */
    if (d > (circle1.radius + circle2.radius)) {
        /* no solution. circles do not intersect. */
        console.log('no intersection');
    }
    if (d < Math.abs(circle1.radius - circle2.radius)) {
        /* no solution. one circle is contained in the other */
        console.log('no intersection');
    }

    var x = (Math.pow(d, 2) - Math.pow(circle2.radius, 2) + Math.pow(circle1.radius, 2)) / (2 * d);
    var angle = Math.atan2(circle2.y-circle1.y,circle2.x-circle1.x);

    if (Math.abs(d - Math.abs(circle1.radius - circle2.radius)) < 1) {
        canvas.drawEllipse({
            strokeStyle: '#00f',
            layer: true,
            x: circle1.x + Math.cos(angle) * x,
            y: circle1.y + Math.sin(angle) * x,
            width: 5, height: 5
        });
    } else {
        var a1 = -d + circle2.radius - circle1.radius;
        var a2 = -d - circle2.radius + circle1.radius;
        var a3 = -d + circle2.radius + circle1.radius;
        var a4 = d + circle2.radius + circle1.radius;
        var a = Math.sqrt(a1 * a2 * a3 * a4) / d;


        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: (circle1.x + Math.cos(angle) * x) + Math.cos(angle + Math.PI / 2) * a / 2,
            y: (circle1.y + Math.sin(angle) * x) + Math.sin(angle + Math.PI / 2) * a / 2,
            width: 100, height: 100
        });
        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: (circle1.x + Math.cos(angle) * x) - Math.cos(angle + Math.PI / 2) * a / 2,
            y: (circle1.y + Math.sin(angle) * x) - Math.sin(angle + Math.PI / 2) * a / 2,
            width: 100, height: 100
        });
    }
}

function line_circle(canvas){
    var a = {
        x: 600,
        y: 300
    };
    var b = {
        x: 700,
        y: 200
    };

    var circle = {
        x: 650,
        y: 250,
        radius: 100
    };
    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y
    });
    canvas.drawEllipse({
        strokeStyle: '#000',
        layer: true,
        x: circle.x,
        y: circle.y,
        width: circle.radius, height: circle.radius
    });

    var d = subtract(b,a);
    var length = Math.sqrt(distance_squared(a,b));
    var D = (a.x * b.y) - (b.x * a.y);
    var discriminant = Math.pow(circle.radius, 2) * Math.pow(length, 2) - Math.pow(D, 2);

    console.log('discriminant: ' + discriminant);
    if (discriminant < 0){
        console.log('no intersection');
    } else if (discriminant === 0){
        console.log('tangent');
    } else {
        console.log('intersect');
    }
}

function line_line(canvas){
    var a = {
        x: 320,
        y: 300
    };
    var b = {
        x: 400,
        y: 200
    };

    var c = {
        x: 300,
        y: 200
    };
    var d = {
        x: 400,
        y: 400
    };

    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y
    });

    canvas.drawLine({
        strokeStyle: '#000',
        strokeWidth: 1,
        layer: true,
        x1: c.x,
        y1: c.y,
        x2: d.x,
        y2: d.y
    });


    var s1 = subtract(b, a);
    var s2 = subtract(d, c);

    var s = (-s1.y * (a.x - c.x) + s1.x * (a.y - c.y)) / (-s2.x * s1.y + s1.x * s2.y);
    var t = ( s2.x * (a.y - c.y) - s2.y * (a.x - c.x)) / (-s2.x * s1.y + s1.x * s2.y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        var angle = Math.atan2(b.y - a.y, b.x - a.x);
        var x = a.x + t * Math.sqrt(distance_squared(a, b)) * Math.cos(angle);
        var y = a.y - t * Math.sqrt(distance_squared(a, b)) * Math.sin(-angle);

        console.log(s + " " + t);
        canvas.drawEllipse({
            fillStyle: '#ff0',
            opacity: 0.5,
            layer: true,
            x: x,
            y: y,
            width: 100, height: 100
        });
    }
}
