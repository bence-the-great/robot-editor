function distance_squared(a, b) {
    return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)
}

function scalar_product(a, b) {
    return (a.x * b.x) + (a.y * b.y)
}

function subtract(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

function projected_point(line, point) {
    nevezo = scalar_product(subtract(point, line.start), subtract(line.end, line.start));
    szam = nevezo / distance_squared(line.end, line.start);

    return {
        x: szam * subtract(line.end, line.start).x + line.start.x,
        y: szam * subtract(line.end, line.start).y + line.start.y
    }
}

function point_is_inside(line, point) {
    return (point.x >= Math.min(line.start.x, line.end.x)) && (point.x <= Math.max(line.start.x, line.end.x)) &&
        (point.y >= Math.min(line.start.y, line.end.y)) && (point.y <= Math.max(line.start.y, line.end.y))
}

function closest_point(line, point) {
    q = projected_point(line, point);
    angle_diff =
        Math.atan2(point.x - line.start.x, point.y - line.start.y)
        - Math.atan2(line.end.x - line.start.x, line.end.y - line.start.y);

    if (Math.abs(angle_diff) > Math.PI) {
        angle_diff = 2 * Math.PI + angle_diff;
    }

    if (point_is_inside(line, q)) {
        return {point: q, angle_diff: angle_diff};
    } else if (distance_squared(line.start, point) < distance_squared(line.end, point)) {
        return {point: line.start, angle_diff: angle_diff};
    } else {
        return {point: line.end, angle_diff: angle_diff};
    }
}

function projected_point_to_arc(arc, point) {
    return {
        x: arc.center.x + (subtract(point, arc.center).x / Math.sqrt(distance_squared(point, arc.center))) * arc.radius,
        y: arc.center.y + (subtract(point, arc.center).y / Math.sqrt(distance_squared(point, arc.center))) * arc.radius
    }
}

function closest_point_to_arc(arc, point) {
    // projekció a körre
    // a vetített pont benne van-e a körívben (szög alapján)
    // a legközelebbi pont (valamelyik végpont, ha a vetített pont nincs benne)
}

function corrigate_angle(angle) {
    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    } else if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
}
