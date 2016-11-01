window.active_segment_index = 0;

function step() {
    var canvas = $('canvas');
    var es = canvas.getLayerGroup('start');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    if (active_segment.configIntervalType === 'TCI') {
        var d = closest_point({
            start: {
                x: active_segment.start.x,
                y: canvas.height() - active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: canvas.height() - active_segment.end.y
            }
        }, position);
        var angle_error = Math.atan2(active_segment.end.y - active_segment.start.y, active_segment.end.x - active_segment.start.x) - position.rotate;
        var angle_output = 0.2 * angle_error;
        console.log('angle_error: ', angle_error);
        console.log('angle_output: ', angle_output);

        var pos_error = Math.sqrt(Math.pow(d.point.x - position.x, 2) + Math.pow(d.point.y - position.y, 2));
        var pos_output = 0.001 * pos_error;
        var aggregated_output = angle_output + pos_output;

        for (var index in es) {
            es[index].x += 1.5 * Math.cos(es[index].rotate + aggregated_output) / Math.cos(aggregated_output);
            es[index].y += 1.5 * Math.sin(es[index].rotate + aggregated_output) / Math.cos(aggregated_output);
            es[index].rotate -= aggregated_output;
        }
        canvas.drawLayers();
    }
}

function highlight_closest_point() {
    var canvas = $('canvas');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    if (active_segment.configIntervalType === 'TCI') {
        var d = closest_point({
            start: {
                x: active_segment.start.x,
                y: canvas.height() - active_segment.start.y
            }, end: {
                x: active_segment.end.x,
                y: canvas.height() - active_segment.end.y
            }
        }, position);
        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: d.point.x, y: d.point.y,
            width: 5, height: 5
        });
    } else if (active_segment.configIntervalType === "ACI"){
        var angle = Math.PI -  Math.atan2((canvas.height() - active_segment.center.y) - position.y, active_segment.center.x - position.x);
        console.log(angle);
        if (angle > Math.max(active_segment.arc_start, active_segment.arc_start + active_segment.delta)){
            angle = Math.max(active_segment.arc_start, active_segment.arc_start + active_segment.delta)
        } else if (angle < Math.min(active_segment.arc_start, active_segment.arc_start + active_segment.delta)) {
            angle = Math.min(active_segment.arc_start, active_segment.arc_start + active_segment.delta);
        }
        canvas.removeLayerGroup('projected');
        canvas.drawEllipse({
            fillStyle: '#f00',
            layer: true,
            groups: ['projected'],
            x: active_segment.center.x + active_segment.radius * Math.cos(angle),
            y: (canvas.height() - active_segment.center.y) - active_segment.radius * Math.sin(angle),
            width: 5, height: 5
        });
    }
}

function deta() {
    var canvas = $('canvas');
    var position = get_start_position(canvas);
    var active_segment = window.path.segments[window.active_segment_index];
    var distance = Math.sqrt(Math.pow(active_segment.end.x - position.x, 2) + Math.pow((canvas.height() - active_segment.end.y) - position.y, 2));
    if (distance < 5) {
        window.active_segment_index += 1;
    }
}
