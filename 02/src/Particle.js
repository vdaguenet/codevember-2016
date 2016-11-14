import Vec2 from 'vec2';

export default class Particle {
  constructor(x = 0, y = 0, color = '#fff') {
    // const
    const MAX_RADIUS = 2.5;
    const MIN_RADIUS = 0.5;
    const MAX_ACCEL_X = 0.2;
    const MIN_ACCEL_X = -0.2;
    const MAX_ACCEL_Y = 0.5;
    const MIN_ACCEL_Y = 0.1;
    const MAX_FRICTION = 0.8;

    // style
    this.radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    this.alpha = this.radius / MAX_RADIUS;
    this.currentAlpha = this.alpha;
    this.color = color;

    // physics
    this.position = new Vec2(x, y);
    this.originalPosition = this.position.clone();
    this.velocity = new Vec2();
    this.acceleration = new Vec2(
      Math.random() * (MAX_ACCEL_X - MIN_ACCEL_X) + MIN_ACCEL_X,
      Math.random() * (MAX_ACCEL_Y - MIN_ACCEL_Y) + MIN_ACCEL_Y
    );
    this.friction = this.alpha * MAX_FRICTION;
    this.gravity = 0;
  }

  reset(x, y) {
    this.position.set(x, y);
    this.velocity.zero();
  }

  update(maxY) {
    this.velocity.add(this.acceleration);
    this.velocity.multiply(this.friction);
    this.velocity.y += this.gravity;
    this.position.add(this.velocity);
    this.currentAlpha = (1 - this.position.y / maxY) * this.alpha;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.globalAlpha = this.currentAlpha;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    context.fill();
  }
}
