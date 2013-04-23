goog.provide('ol.renderer.webgl.VectorLayer2');

goog.require('goog.vec.Mat4');
goog.require('goog.webgl');
goog.require('ol.math');
goog.require('ol.renderer.webgl.Layer');
goog.require('ol.renderer.webgl.vectorlayer2.shader.PointCollection');



/**
 * @constructor
 * @extends {ol.renderer.webgl.Layer}
 * @param {ol.renderer.Map} mapRenderer Map renderer.
 * @param {ol.layer.VectorLayer2} vectorLayer2 Vector layer.
 */
ol.renderer.webgl.VectorLayer2 = function(mapRenderer, vectorLayer2) {

  goog.base(this, mapRenderer, vectorLayer2);

  goog.vec.Mat4.makeIdentity(this.projectionMatrix);

  /**
   * @private
   * @type {!goog.vec.Mat4.Number}
   */
  this.modelViewMatrix_ = goog.vec.Mat4.createNumberIdentity();

  /**
   * @private
   * @type {ol.renderer.webgl.vectorlayer2.shader.PointCollection.Locations}
   */
  this.pointCollectionLocations_ = null;

};
goog.inherits(ol.renderer.webgl.VectorLayer2, ol.renderer.webgl.Layer);


/**
 * @return {ol.layer.VectorLayer2} Vector layer.
 */
ol.renderer.webgl.VectorLayer2.prototype.getVectorLayer = function() {
  return /** @type {ol.layer.VectorLayer2} */ (this.getLayer());
};


/**
 * @inheritDoc
 */
ol.renderer.webgl.VectorLayer2.prototype.handleWebGLContextLost = function() {
  goog.base(this, 'handleWebGLContextLost');
  this.pointCollectionLocations_ = null;
};


/**
 * @inheritDoc
 */
ol.renderer.webgl.VectorLayer2.prototype.renderFrame =
    function(frameState, layerState) {

  var mapRenderer = this.getWebGLMapRenderer();
  var gl = mapRenderer.getGL();

  var view2DState = frameState.view2DState;

  var vectorLayer = this.getVectorLayer();
  var vectorSource = vectorLayer.getVectorSource();

  var size = frameState.size;
  var framebufferDimension = ol.math.roundUpToPowerOfTwo(
      Math.max(size.width, size.height));

  this.bindFramebuffer(frameState, framebufferDimension);
  gl.viewport(0, 0, framebufferDimension, framebufferDimension);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(goog.webgl.COLOR_BUFFER_BIT);
  gl.enable(goog.webgl.BLEND);

  goog.vec.Mat4.makeIdentity(this.modelViewMatrix_);
  if (view2DState.rotation !== 0) {
    goog.vec.Mat4.rotateZ(this.modelViewMatrix_, -view2DState.rotation);
  }
  goog.vec.Mat4.scale(this.modelViewMatrix_,
      2 / (framebufferDimension * view2DState.resolution),
      2 / (framebufferDimension * view2DState.resolution),
      1);
  goog.vec.Mat4.translate(this.modelViewMatrix_,
      -view2DState.center[0],
      -view2DState.center[1],
      0);

  var pointCollections = vectorSource.getPointCollections();
  if (pointCollections.length > 0) {
    this.renderPointCollections(pointCollections);
  }

  goog.vec.Mat4.makeIdentity(this.texCoordMatrix);
  goog.vec.Mat4.translate(this.texCoordMatrix,
      0.5,
      0.5,
      0);
  goog.vec.Mat4.scale(this.texCoordMatrix,
      size.width / framebufferDimension,
      size.height / framebufferDimension,
      1);
  goog.vec.Mat4.translate(this.texCoordMatrix,
      -0.5,
      -0.5,
      0);

};


/**
 * @param {Array.<ol.geom2.PointCollection>} pointCollections Point collections.
 */
ol.renderer.webgl.VectorLayer2.prototype.renderPointCollections =
    function(pointCollections) {

  var mapRenderer = this.getWebGLMapRenderer();
  var gl = mapRenderer.getGL();

  var fragmentShader = ol.renderer.webgl.vectorlayer2.shader.
      PointCollectionFragment.getInstance();
  var vertexShader = ol.renderer.webgl.vectorlayer2.shader.
      PointCollectionVertex.getInstance();
  var program = mapRenderer.getProgram(fragmentShader, vertexShader);
  gl.useProgram(program);
  if (goog.isNull(this.pointCollectionLocations_)) {
    this.pointCollectionLocations_ =
        new ol.renderer.webgl.vectorlayer2.shader.PointCollection.Locations(
            gl, program);
  }

  gl.uniformMatrix4fv(this.pointCollectionLocations_.u_modelViewMatrix, false,
      this.modelViewMatrix_);

  var buf, dim, i, pointCollection;
  for (i = 0; i < pointCollections.length; ++i) {
    pointCollection = pointCollections[i];
    buf = pointCollection.buf;
    dim = pointCollection.dim;
    mapRenderer.bindBuffer(goog.webgl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(this.pointCollectionLocations_.a_position);
    gl.vertexAttribPointer(this.pointCollectionLocations_.a_position, 2,
        goog.webgl.FLOAT, false, 4 * dim, 0);
    gl.uniform4fv(this.pointCollectionLocations_.u_color, [1, 0, 0, 0.75]);
    gl.uniform1f(this.pointCollectionLocations_.u_pointSize, 3);
    buf.forEachRange(function(start, stop) {
      gl.drawArrays(goog.webgl.POINTS, start / dim, (stop - start) / dim);
    });
  }

};
