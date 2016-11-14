export default {
  x: 0,
  y: 0,
  set(x, y) {
    this.x = x;
    this.y = y;
  },
  getNormalizedCoords(width, height) {
    return {
      x: (this.x - 0.5 * width) / (0.5 * width),
      y: (0.5 * height - this.y) / (0.5 * height)
    };
  }
};
