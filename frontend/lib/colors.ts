export function pastelColors(i: number) {
    var r = Math.round(i + 127).toString(16);
    var g = Math.round(i + 1 + 127).toString(16);
    var b = Math.round(i + 2 + 127).toString(16);
    return "#" + r + g + b;
}
