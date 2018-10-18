
import React, { Component } from 'react';
import { connect } from 'dva';

const testData = [
  { id: 1,
    text: '1',
    child: [
      { id: 2,
        text: '2',
        p_id: 1,
        child: [
          { id: 4,
            text: '3',
            p_id: 2,
            next_id: 3,
            child: [
              { id: 3,
                text: '3',
                p_id: 2,
                child: [
                ],
              },
            ],
          },
        ],
      },
      { id: 3,
        text: '3',
        p_id: 1,
        child: [
          { id: 5,
            text: '5',
            p_id: 3,
            child: [

            ],
          },
        ],
      },
    ] },
];
@connect()
export default class Test extends Component {
  componentDidMount() {
    this.draw();
  }
  draw=() => {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(75, 50);
      ctx.lineTo(100, 75);
      ctx.lineTo(100, 25);
      ctx.fill();
    }
  }
  render() {
    return (
      <canvas id="canvas" width="150" height="150" />
    );
  }
}
