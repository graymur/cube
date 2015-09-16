"use strict";

import ImagesPreloaderQueue from './utils/ImagesPreloaderQueue.js';
import ProgressMeter from './utils/ProgressMeter.js';
import React from 'react';
import CubeView from './app/views/CubeView.jsx';

let dv = console.log.bind(console);

function start() {
    let body = document.querySelector('BODY');
    let progressMeterContainer = document.querySelector('.js-preloader-container');
    let progressMeter = React.render(<ProgressMeter />, progressMeterContainer);
    let isDragging = false;

    let queue = new ImagesPreloaderQueue;
    queue.add(imagesArray);

    queue.addOnQueueLoadCallback(() => {
        body.classList.add('_loaded');

        progressMeter.hide();
        let cube = React.render(<CubeView images={queue.getLoaded()}/>, document.querySelector('.js-cube-container'));

        //body.addEventListener ("drag", function (e) {
        //    dv(e);
        //});

        body.onmousedown = function(e) {
            isDragging = true;
        };

        body.onmousemove = function(e) {
            if (isDragging) {
                cube.rotateFromMouseEvent(e);
            }
        };

        body.onmouseup = function () {
            isDragging = false;
        };
    });

    queue.addOnAfterItemLoadCallback(() => {
        progressMeter.updateValue(Math.round(queue.getProgress() * 100));
    });

    queue.start();
}

window.onload = start;