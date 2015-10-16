import React from 'react';

export default class SideView extends React.Component {
    constructor(props) {
        super(props);

        this.mouseDownTimeout = 0;
        this.side = undefined;
        this.images = undefined;
        this.currentImageIndex = 0;
        this.timeoutId = undefined;
    }

    componentDidMount() {
        this.side = React.findDOMNode(this.refs.side);
        this.images = Array.from(this.side.children);
        this.images[0].classList.add('_active');

        this.cycleImages();
    }

    activateNext() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;

        this.images.forEach((image, index) => {
            if (index === this.currentImageIndex) {
                image.classList.add('_active');
            } else {
                image.classList.remove('_active');
            }
        });
    }

    cycleImages() {
        let interval = this.constructor.getRandomInt(2000, 5000);

        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            this.activateNext();
            this.cycleImages();
        }, interval)
    }

    pauseImages() {
        clearTimeout(this.timeoutId);
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    onMouseDown(event) {
        this.mouseDownTimeout = Date.now();
    }

    /**
     * Fire only on click, not on drag
     * @returns {boolean}
     */
    onMouseUp(event) {
        //if (event.which != 1) return ;

        let x, y;

        if (Date.now() - this.mouseDownTimeout < 150) {
            switch (this.props.number) {
                case 1:
                    x = this.getAngle(0, x);
                    y = this.getAngle(0, y);
                    break;

                case 2:
                    x = this.getAngle(0, x);
                    y = this.getAngle(-90, y);
                    break;

                case 3:
                    x = this.getAngle(90, x);
                    y = this.getAngle(0, y);
                    break;

                case 4:
                    x = this.getAngle(0, x);
                    y = this.getAngle(90, y);
                    break;

                case 5:
                    x = this.getAngle(-90, x);
                    y = this.getAngle(0, y);
                    break;

                case 6:
                    x = this.getAngle(0, x);
                    y = this.getAngle(180, y);
                    break;
            }

            this.props.rotate(x, y, true);
        }
    }

    onMouseOver() {
        this.pauseImages();
    }

    onMouseOut() {
        this.cycleImages();
    }

    getAngle(target, current) {
        var v = 360, oc = target;

        if (Math.abs(target - current) > v / 2) {
            var c = Math.round(Math.abs(current) / v);

            if (current > 0) {
                target += v * c;
            } else {
                target -= v * c;
            }
        }

        return target;
    }

    onClick() {
        console.log('click');
    }

    render() {
        let className = `side n${this.props.number}`;

        return (
            <span ref="side" className={className} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseOver={this.onMouseOver.bind(this)} onMouseOut={this.onMouseOut.bind(this)}>
               {
                   this.props.images.map(function(image) {
                       return <span style={{ backgroundImage: 'url(' + image + ')' }} className="image"></span>
                   })
               }
            </span>
        );
    }
}


