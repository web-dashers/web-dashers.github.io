class Collider {
  constructor(objType, xPos, yPos, width, height, rotation = 0) {
    this.type = objType;
    this.x = xPos;
    this.y = yPos;
    this.w = width;
    this.h = height;
    this.activated = false;
    this.rotationDegrees = rotation;
    this.slopeAngleDeg = 0;
    this.slopeDir = 1;
    this.slopeIsFilled = false;
    this.slopeFlipY = false;
    this.hypoAx = 0; this.hypoAy = 0;
    this.hypoBx = 0; this.hypoBy = 0;
    this.rightAx = 0; this.rightAy = 0;
    this.slopeSolidBelow = true;
  }
  getSlopeSurfaceY(worldX) {
    if (this.type !== slopeType) return null;
    const ax = this.x + this.hypoAx, ay = this.y + this.hypoAy;
    const bx = this.x + this.hypoBx, by = this.y + this.hypoBy;
    const lo = ax <= bx ? { x: ax, y: ay } : { x: bx, y: by };
    const hi = ax <= bx ? { x: bx, y: by } : { x: ax, y: ay };
    if (hi.x - lo.x < 0.01) return null;
    if (worldX < lo.x || worldX > hi.x) return null;
    const t = (worldX - lo.x) / (hi.x - lo.x);
    return lo.y + t * (hi.y - lo.y);
  }
  getSlopeAngleRad() {
    if (this.type !== slopeType) return 0;
    return Math.atan2(this.hypoBy - this.hypoAy, this.hypoBx - this.hypoAx);
  }
  usesFloorLanding(gravityFlipped) {
    return this.isSolidBelowSurface(gravityFlipped);
  }
  isSolidBelowSurface(gravityFlipped) {
    return this.slopeSolidBelow !== gravityFlipped;
  }
  isSlopeSolidAt(worldX, worldY, gravityFlipped = false) {
    if (this.type !== slopeType) return false;
    const halfW = this.w / 2;
    const halfH = this.h / 2;
    const left = this.x - halfW;
    const right = this.x + halfW;
    const bboxBottom = this.y - halfH;
    const bboxTop = this.y + halfH;
    if (worldX < left || worldX > right || worldY < bboxBottom || worldY > bboxTop) {
      return false;
    }
    if (this.slopeIsFilled) {
      return true;
    }
    const surfaceY = this.getSlopeSurfaceY(worldX);
    if (surfaceY === null) return false;
    return this.isSolidBelowSurface(gravityFlipped) ? worldY < surfaceY : worldY > surfaceY;
  }
  getSlopeBackWallSide(gravityFlipped = false) {
    let leftWall = this.slopeDir > 0;
    if (!this.isSolidBelowSurface(gravityFlipped)) leftWall = !leftWall;
    return leftWall ? "left" : "right";
  }
}
