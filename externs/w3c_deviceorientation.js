/**
 * @fileoverview Definitions for W3C's DeviceOrientation and
 *   DeviceMotion events.
 * @see http://www.w3.org/TR/orientation-event/
 * @externs
 */

/**
 * @see http://www.w3.org/TR/orientation-event/#deviceorientation
 * @extends {Event}
 * @constructor
 */
function DeviceOrientationEvent() {}
/** @type {number} */ DeviceOrientationEvent.prototype.alpha;
/** @type {number} */ DeviceOrientationEvent.prototype.beta;
/** @type {number} */ DeviceOrientationEvent.prototype.gamma;
/** @type {boolean} */ DeviceOrientationEvent.prototype.absolute;
/* Only available in iOS 5.0 and later. */
/** @type {number} */ DeviceOrientationEvent.prototype.webkitCompassAccuracy;
/** @type {number} */ DeviceOrientationEvent.prototype.webkitCompassHeading;


/**
 * @see http://www.w3.org/TR/orientation-event/#devicemotion
 * @constructor
 */
function DeviceAcceleration() {}
/** @type {number} */ DeviceAcceleration.prototype.x;
/** @type {number} */ DeviceAcceleration.prototype.y;
/** @type {number} */ DeviceAcceleration.prototype.z;

/**
 * @see http://www.w3.org/TR/orientation-event/#devicemotion
 * @constructor
 */
function DeviceRotationRate() {}
/** @type {number} */ DeviceRotationRate.prototype.alpha;
/** @type {number} */ DeviceRotationRate.prototype.beta;
/** @type {number} */ DeviceRotationRate.prototype.gamma;

/**
 * @see http://www.w3.org/TR/orientation-event/#devicemotion
 * @extends {Event}
 * @constructor
 */
function DeviceMotionEvent() {}
/** @type {DeviceAcceleration} */ DeviceMotionEvent.prototype.acceleration;
/** @type {DeviceAcceleration} */
DeviceMotionEvent.prototype.accelerationIncludingGravity;
/** @type {DeviceRotationRate} */ DeviceMotionEvent.prototype.rotationRate;
/** @type {number} */ DeviceMotionEvent.prototype.interval;
