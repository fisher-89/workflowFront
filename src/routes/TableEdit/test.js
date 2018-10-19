
import React, { Component } from 'react';
import { connect } from 'dva';

const horizontal = 30;
const startPoint = [30, 30];
const testData = [
  {
    id: 1,
    text: '1',
    time: '1',
    child: [
      {
        id: 2,
        text: '2',
        time: '4',
        p_id: 1,
        child: [
          {
            id: 5,
            text: '5',
            time: '5',
            p_id: 1,
          },
        ],
      },
      {
        id: 3,
        text: '3',
        p_id: 1,
        time: '3',
        child: [
          {
            id: 6,
            text: '6',
            time: '6',
            p_id: 3,
            child: [{
              id: 7,
              text: '7',
              time: '7',
              p_id: 3,
            },

            ],
          },
        ],
      },
      {
        id: 4,
        text: '4',
        time: '2',
        p_id: 1,
      },
    ],
  },
];
@connect()
export default class Test extends Component {
  componentDidMount() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.draw(testData, 20, 1, 0);
    // this.drawArc(20, 20, 5, 0, 2 * Math.PI);
    // this.drawLine(25, 20, 50, 20);
  }

  vertivalGap = (start, end, height) => {
    const interval = (end - start) / height;
  }

  drawLine = (x1, y1, x2, y2) => {
    if (this.canvas) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  drawArc = (x, y, r, sAngle, eAngle) => {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle);
    ctx.stroke();
  }

  drawText = (str, x, y) => {
    if (this.canvas) {
      const { ctx } = this;
      ctx.font = '12px Georgia';
      ctx.fillText(str, x, y);
    }
  }

  draw = (data, gap, childIndex = 1, level, r = 5) => {
    data.forEach((item, i) => {
      const { child } = item;
      const [startX, startY] = startPoint;
      const rx = startX + (i * horizontal);
      const ry = startY + (gap * item.time);
      this.drawArc(rx, ry, r, 0, 2 * Math.PI);
      this.drawText(item.text, rx, ry + 8);
      if (child) {
        console.log(i);

        this.draw(child, gap, i, level + 1);
      }
    });
  }
  render() {
    return (
      <div>
        <canvas id="myCanvas" width="300" height="600" />
      </div>
    );
  }
}
