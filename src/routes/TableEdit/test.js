/* eslint-disable */

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

const test = [
  { id: 1, time: '', next: [2, 3, 4], prev: [] },
  { id: 2, time: '', next: [8], prev: [1] },
  { id: 3, time: '', next: [5, 6], prev: [1] },
  { id: 4, time: '', next: [8], prev: [1] },
  { id: 5, time: '', next: [7], prev: [3] },
  { id: 6, time: '', next: [7], prev: [3] },
  { id: 7, time: '', next: [8], prev: [5, 6] },
  { id: 8, time: '', next: [9, 10], prev: [2, 4, 7] },
  { id: 9, time: '', next: [11], prev: [8] },
  { id: 10, time: '', next: [11], prev: [8] },
  { id: 11, time: '', next: [], prev: [9, 10] },
];

const cols = {};
const testKeyById = {};
let colIndex = 1;

@connect()
export default class Test extends Component {
  componentDidMount() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    test.forEach((step, index) => {
      testKeyById[step.id] = step;
      step.y = index + 1;
      //绑定点的X坐标
      if (step.prev.length === 0) {//主节点
        step.x = cols;
        step.max = cols;
      } else if (step.prev.length > 1) {//合并
        const separateStepId = this.getCommonPrevStep(step.prev);
        const separateStep = testKeyById[separateStepId];
        step.x = separateStep.x;
        step.max = separateStep.max;
      } else {//不分叉
        const prevStep = testKeyById[step.prev[0]];
        if (prevStep.next.length > 1) {
          const subIndex = prevStep.next.indexOf(step.id);
          step.x = prevStep.x[subIndex];
          step.max = prevStep.x[prevStep.next.length - 1];
        } else {
          step.x = prevStep.x;
          step.max = prevStep.max;
        }
      }
      // 生成cols分支
      if (step.next.length > 1) {
        step.next.forEach((next_id, next_index) => {
          step.x[next_index] = step.x[next_index] || {};
        });
      }
    });
    this.fillColsIndex(cols);
    console.log('test:', test);
    console.log('cols:', cols);

    // this.draw(testData, 20, 1, 0);
    // this.drawArc(20, 20, 5, 0, 2 * Math.PI);
    // this.drawLine(25, 20, 50, 20);
  }

  getCommonPrevStep = (stepIds) => {
    const prevLength = stepIds.length;
    let baseLength = prevLength;
    const steps = test.filter(item => stepIds.indexOf(item.id) !== -1);
    // const step = steps[0];
    let prevStepIds = [];
    steps.forEach((step) => {
      if (step.prev.length > 1) {
        prevStepIds.concat(step.prev);
      } else {
        prevStepIds.push(step.prev[0]);
      }
    })
    prevStepIds = prevStepIds.unique();
    if (prevStepIds.length > 1) {
      return this.getCommonPrevStep(prevStepIds);
    } else {
      return prevStepIds[0];
    }

    //  if(step.prev.length)
    // baseLength = baseLength - step.next.length + 1;
    // baseLength = baseLength + step.prev.length - 1;
    // prevStepIds.push(step.prev[0])
    // if (baseLength!==step.prev.length){
    //   return this.getCommonPrevStep(prevStepIds)
    // }
    // else {
    //   return prevStepIds
    // }
  }

  fillColsIndex = (cols) => {
    const index = colIndex;
    Object.keys(cols).forEach((key) => {
      if (key > 0) colIndex += 1;
      this.fillColsIndex(cols[key]);
    });
    cols.index = index;
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
