$(function () {
    var canvas = $('canvas');
    setup_start_and_goal(canvas);
    setup_save(canvas);
    setup_drawing(canvas);
    setup_ros(
        $('input[name=ros-bridge]').val()
    );

    $('input[name=ros-bridge]').on('change', function () {
        setup_ros($(this).val(), window.ros_topic);
    });

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
});
