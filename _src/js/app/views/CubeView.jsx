import React from 'react';
import SideView from './SideView.jsx';

export default class CubeView extends React.Component {
    constructor(props) {
        super(props);

        this.cube = undefined;
        this.prevX = 0;
        this.prevY = 0;
        this.step = 2;
        this.currentX = -45;
        this.currentY = 45;
        this.currentZoom = 0.8;
        this.zoomStep = 0.05;

        this.state = {
            x: -45,
            y: 45
        };
    }

    componentDidMount() {
        this.cube = React.findDOMNode(this.refs.cube);
    }

    apply(animate) {
        this.cube.style.transition = animate ? 'all 0.3s' : '';
        this.cube.style.transform = "perspective(1000px) rotateX(" + this.currentX + "deg) rotateY(" + this.currentY + "deg)";
    }

    rotate(x = 0, y = 0, animate = false) {
        this.currentX = x;
        this.currentY = y;
        this.apply(animate);
    }

    rotateFromMouseEvent(event) {
        let clientX, clientY, x, y;

        if (event.touches) {
            clientX = event.touches[0].pageX;
            clientY = event.touches[0].pageY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        x = clientX;
        y = clientY;

        if (x > this.prevX) {
            this.currentY += this.step;
        } else if (x < this.prevX) {
            this.currentY -= this.step;
        }

        if (y > this.prevY) {
            this.currentX -= this.step;
        } else if (y < this.prevY) {
            this.currentX += this.step;
        }

        this.prevX = x;
        this.prevY = y;

        this.apply();
    }

    zoom(value) {
        this.currentZoom = value;
        this.cube.parentNode.style.transform = 'scale(' + this.currentZoom + ')';
    }

    zoomFromMouseEvent(event) {
        if (('detail' in event && event.detail > 0) || ('wheelDelta' in event && event.wheelDelta < 0)) {
            this.currentZoom -= this.zoomStep;
        } else {
            this.currentZoom += this.zoomStep;
        }

        this.currentZoom = Math.round(this.currentZoom * 100) / 100;

        if (this.currentZoom < 0.05) {
            this.currentZoom = 0.05;
        }

        this.zoom(this.currentZoom);
    }

    render() {
        let sides = [];

        let chunkLength = Math.ceil(this.props.images.length / 6);

        for (let i = 1; i <= 6; i++) {
            let images = this.props.images.slice((i - 1) * chunkLength, i * chunkLength);
            sides.push(<SideView key={i} number={i} images={images} rotate={this.rotate.bind(this)} />);
        }

        return (
            <div className="cube" ref="cube" style={{ transform: "perspective(1000px) rotateX(" + this.currentX + "deg) rotateY(" + this.currentY + "deg)" }}>
                {sides}
            </div>
        );
    }
}