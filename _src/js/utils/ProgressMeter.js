"use strict";

import React from 'react';

export default class ProgressMeter extends React.Component {
    constructor(props) {
        super(props);

        this.circle = undefined;

        this.state = {
            value: 10,
            radius: 90,
            visible: true
        };
    }

    updateValue(value) {
        this.setState( { value: value } );

        let c = Math.PI * (this.state.radius * 2);
        let pct;

        if (value < 0) {
            value = 0;
        }

        if (value > 100) {
            value = 100;
        }

        pct = ((100 - value) / 100) * c;

        this.circle.style.strokeDashoffset = pct;
    }

    componentDidMount() {
        this.circle = React.findDOMNode(this.refs.circle);
    }

    hide() {
        this.setState( { visible: false } )
    }

    render() {
        let className = 'preloader' + (this.state.visible ? '' : ' _hidden');

        return (
            <div className={className} data-pct={this.state.value}>
                <svg id="preloader-svg" width="200" height="200" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#b2e199"/>
                        <stop offset="50%" stopColor="#abc4d4"/>
                        <stop offset="100%" stopColor="#f9a397"/>
                    </linearGradient>
                    <circle ref="circle" id="bar" r={this.state.radius} cx="50%" cy="50%" fill="transparent" strokeDasharray="565.48" transform="rotate(-90 100 100)" strokeLinecap="round" style={{ stroke: "url(#gradient)", strokeDashoffset: "565.48px" }}></circle>
                </svg>
            </div>
        );
    }
}

