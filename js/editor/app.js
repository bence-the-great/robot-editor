$(function () {
    var canvas = $('canvas');
    window.canvas = canvas;
    setup_start_and_goal(canvas);
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

    $('#start-button').on('click', function (e) {
        window.path_follower_interval = setInterval(step, 30)
    });


});
