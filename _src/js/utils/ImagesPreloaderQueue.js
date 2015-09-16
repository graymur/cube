"use strict";

export default class ImagesPreloaderQueue {
    constructor() {
        this.loaded = [];
        this.errors = [];
        this.queue = [];
        this.currentImageSrc = undefined;
        this.currentImageObject = undefined;
        this.onItemErrorCallbacks = [];
        this.onBeforeItemLoadCallbacks = [];
        this.onAfterItemLoadCallbacks = [];
        this.onAfterItemCallbacks = [];
        this.onQueueLoadCallbacks = [];
        this.started = undefined;
    }

    /**
     * Adds images
     */
    add(...args) {

        args = args.reduce((carry, element) => {
            if (Object.prototype.toString.call(element) === '[object Array]') {
                carry = carry.concat(element);
            } else {
                carry.push(element);
            }

            return carry;
        });

        this.queue = this.queue.concat(args);
    }

    /*
     * Start and continue paused queue
     */
    start() {
        // continue loading paused image
        if (this.currentImageObject && !this.isStarted()) {
            this.loadImage(this.currentImageSrc);
            // queue is empty
        } else if (this.loaded.length === 0 && this.queue.length === 0 && !this.currentImageSrc) {
            throw new Error('You must add images to queue');
            // all images were loaded
        } else if (this.queue.length === 0) {
            this.runCallbacks(this.onQueueLoadCallbacks);
            // start loading next image
        } else if (!this.isStarted()) {
            this.currentImageSrc = this.queue.splice(0, 1)[0];
            this.loadImage(this.currentImageSrc);
        }
    }

    /**
     * @returns {boolean}
     */
    isStarted() {
        return this.started;
    }

    /**
     * Load single image
     * @param src
     */
    loadImage(src) {
        this.started = true;
        this.runCallbacks(this.onBeforeItemLoadCallbacks, [src]);
        this.currentImageObject = new Image();

        let self = this;

        this.currentImageObject.onload = function () {
            self.onItemLoad(src);
        };

        this.currentImageObject.onerror = function () {
            self.onItemError(src, arguments[0]);
        };

        this.currentImageObject.src = src;
    }

    /**
     * Fires when images is loaded, executes callback, start next image
     * @param src
     */
    onItemLoad(src) {
        this.runCallbacks(this.onAfterItemLoadCallbacks, [src]);
        this.runCallbacks(this.onAfterItemCallbacks, [src]);
        this.loaded.push(src);
        this.cleanUp();
        this.start();
    }

    /**
     * Fires when images failed to load, executes callback, start next image
     * @param src
     */
    onItemError(src) {
        this.runCallbacks(this.onItemErrorCallbacks, [src]);
        this.runCallbacks(this.onAfterItemCallbacks, [src]);
        this.errors.push(src);
        this.cleanUp();
        this.start();
    }

    /**
     * Clear variables
     */
    cleanUp() {
        this.currentImageObject = null;
        this.currentImageSrc = null;
        this.started = false;
    }

    /**
     * Pause queue
     */
    pause() {
        this.started = false;

        if (this.currentImageObject) {
            this.currentImageObject.src = '';
        }
    }

    /**
     * Pause queue for {value} milliseconds
     * @param value
     */
    pauseFor(value) {
        this.pause();
        setTimeout(this.start.bind(this), value);
    }

    /**
     * Adds callback for failed load
     * @param fn
     */
    addOnItemErrorCallbacks(fn) {
        this.onItemErrorCallbacks.push(fn);
    }

    /**
     * Adds callback for before loading
     * @param fn
     */
    addOnBeforeItemLoadCallback(fn) {
        this.onBeforeItemLoadCallbacks.push(fn);
    }

    /**
     * Adds callback for after successful load
     * @param fn
     */
    addOnAfterItemLoadCallback(fn) {
        this.onAfterItemLoadCallbacks.push(fn);
    }

    /**
     * Adds callback that is executed regardless of load status
     * @param fn
     */
    addOnAfterItemCallback(fn) {
        this.onAfterItemCallbacks.push(fn);
    }

    /**
     * Adds callback for queue finish
     * @param fn
     */
    addOnQueueLoadCallback(fn) {
        this.onQueueLoadCallbacks.push(fn);
    }

    /**
     * Return queue progress: number of finished loads / total items in queue
     * @returns {number}
     */
    getProgress() {
        var processed = this.loaded.length + this.errors.length;
        return processed / (processed + this.queue.length);
    }

    /**
     * Runs array of callbacks with given arguments
     * @param callbacks
     * @param args
     */
    runCallbacks(callbacks, args) {
        for (let i = 0; i < callbacks.length; i++) {
            if (typeof callbacks[i] !== 'function') continue;
            callbacks[i].apply(null, args);
        }
    }

    /**
     * Return list of loaded images
     * @returns {Array}
     */
    getLoaded() {
        return this.loaded;
    }

    /**
     * Return list of queued images
     * @returns {Array}
     */
    getQueue() {
        return this.queue;
    }
}