import {Component} from '../Component.js';
import {RenderState} from '../webgl/RenderState.js';

/**
 *  @desc An arbitrarily-aligned World-space clipping plane.
 *
 * * Slices portions off objects to create cross-section views or reveal interiors.
 * * Registered by {@link SectionPlane#id} in {@link Scene#sectionPlanes}.
 * * Indicates World-space position in {@link SectionPlane#pos} and orientation in {@link SectionPlane#dir}.
 * * Discards elements from the half-space in the direction of {@link SectionPlane#dir}.
 * * Can be be enabled or disabled via {@link SectionPlane#active}.
 *
 * ## Usage
 *
 * ````javascript
 * // Create a SectionPlane on negative diagonal
 * const sectionPlane1 = new SectionPlane(myViewer.scene, {
 *     pos: [1.0, 1.0, 1.0],
 *     dir: [-1.0, -1.0, -1.0],
 *     active: true
 * }),
 *
 * // Create a SectionPlane on positive diagonal
 * const sectionPlane2 = new SectionPlane(myViewer.scene, {
 *     pos: [-1.0, -1.0, -1.0],
 *     dir: [1.0, 1.0, 1.0],
 *     active: true
 * });
 *
 * // Create a Mesh that clipped by our Clips
 * var mesh = new Mesh(myViewer.scene, {
 *      geometry: new SphereGeometry(),
 *      clippable: true // Enable clipping (default)
 * });
 * ````
 *
 * ## Selectively enabling or disabling clipping
 *
 * {@link Node#clippable} and {@link Mesh#clippable} indicate if the Node or Mesh is affected by SectionPlane components.
 *
 * You can switch it at any time, like this:
 *
 * ```` javascript
 * // Disable clipping for the Mesh
 * mesh.clippable = false;
 *
 * // Enable clipping for the Mesh
 * mesh.clippable = true;
 * ````
 */
class SectionPlane extends Component {

    /**
     @private
     */
    get type() {
        return "SectionPlane";
    }

    /**
     * @constructor
     * @param {Component} [owner]  Owner component. When destroyed, the owner will destroy this SectionPlane as well.
     * @param {*} [cfg]  SectionPlane configuration
     * @param  {String} [cfg.id] Optional ID, unique among all components in the parent {@link Scene}, generated automatically when omitted.
     * @param {Boolean} [cfg.active=true] Indicates whether or not this SectionPlane is active.
     * @param {Number[]} [cfg.pos=[0,0,0]] World-space position of the SectionPlane.
     * @param {Number[]} [cfg.dir=[0,0 -1]] Vector perpendicular to the plane surface, indicating the SectionPlane plane orientation.
     */
    constructor(owner, cfg = {}) {

        super(owner, cfg);

        this._state = new RenderState({
            active: true,
            pos: new Float32Array(3),
            dir: new Float32Array(3)
        });

        this.active = cfg.active;
        this.pos = cfg.pos;
        this.dir = cfg.dir;

        this.scene._sectionPlaneCreated(this);
    }

    /**
     * Sets if this SectionPlane is active or not.
     *
     * Default value is ````true````.
     *
     * @param {Boolean} value Set ````true```` to activate else ````false```` to deactivate.
     */
    set active(value) {
        this._state.active = value !== false;
        this.glRedraw();
        /**
         Fired whenever this SectionPlane's {@link SectionPlane#active} property changes.

         @event active
         @param value {Boolean} The property's new value
         */
        this.fire("active", this._state.active);
    }

    /**
     * Gets if this SectionPlane is active or not.
     *
     * Default value is ````true````.
     *
     * @returns {Boolean} Returns ````true```` if active.
     */
    get active() {
        return this._state.active;
    }

    /**
     * Sets the World-space position of this SectionPlane's plane.
     *
     * Default value is ````[0, 0, 0]````.
     *
     * @param {Number[]} value New position.
     */
    set pos(value) {
        this._state.pos.set(value || [0, 0, 0]);
        this.glRedraw();
        /**
         Fired whenever this SectionPlane's {@link SectionPlane#pos} property changes.

         @event pos
         @param value Float32Array The property's new value
         */
        this.fire("pos", this._state.pos);
    }

    /**
     * Gets the World-space position of this SectionPlane's plane.
     *
     * Default value is ````[0, 0, 0]````.
     *
     * @returns {Number[]} Current position.
     */
    get pos() {
        return this._state.pos;
    }

    /**
     * Sets the direction of this SectionPlane's plane.
     *
     * Default value is ````[0, 0, -1]````.
     *
     * @param {Number[]} value New direction.
     */
    set dir(value) {
        this._state.dir.set(value || [0, 0, -1]);
        this.glRedraw();
        /**
         Fired whenever this SectionPlane's {@link SectionPlane#dir} property changes.

         @event dir
         @param value {Number[]} The property's new value
         */
        this.fire("dir", this._state.dir);
    }

    /**
     * Gets the direction of this SectionPlane's plane.
     *
     * Default value is ````[0, 0, -1]````.
     *
     * @returns {Number[]} value Current direction.
     */
    get dir() {
        return this._state.dir;
    }

    /**
     * @destroy
     */
    destroy() {
        this._state.destroy();
        this.scene._sectionPlaneDestroyed(this);
        super.destroy();
    }
}

export {SectionPlane};