$(function () {
    var canvas = $('canvas');
    window.canvas = canvas;
    // add_start_and_goal(canvas, robot_count);
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

    test_data(canvas);
});
