/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'dva';
import { remove } from 'lodash';

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
const lines = [];
const unfinishedLines = [];
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
        const firstLine = this.createNewColLine(cols, '0.');
        step.line = firstLine;
        step.unfinishedLines = [...unfinishedLines];
      } else if (step.prev.length > 1) {//合并
        const prevSteps = test.filter(item => step.prev.indexOf(item.id) !== -1);
        let max = '0';
        let min = '1';
        prevSteps.forEach((prevStep) => {
          const { colIndex } = prevStep;
          this.finishColLine(prevStep.line, step.y - 0.5); //上一条线的结束点
          max = colIndex - max >= 0 ? colIndex : max;
          min = colIndex - min <= 0 ? colIndex : min;
        });
        unfinishedLines.forEach((line) => {//交叉
          if (line.colIndex > min && line.colIndex < max) {
            line.crossingPoint.push(step.y - 0.5);//交叉点
          }
        });
        const prevLines = prevSteps.map(item => item.line);
        const basicLine = this.findBasicLine(prevLines);
        const newLine = this.createNewColLine(basicLine.col, basicLine.colIndex, step.y - 0.5, prevLines);
        step.line = newLine;
        step.unfinishedLines = [...unfinishedLines];
      } else {//不分叉
        const prevStep = testKeyById[step.prev[0]];
        if (prevStep.next.length > 1) {
          const subIndex = prevStep.next.indexOf(step.id);
          const newLine = this.separateColLine(prevStep.line, prevStep.y + 0.5, subIndex);
          step.line = newLine;
          step.unfinishedLines = [...unfinishedLines];
        } else {
          step.line = prevStep.line;
          step.unfinishedLines = prevStep.unfinishedLines;
        }
      }
      // 生成cols分支
      if (step.next.length > 1) {
        this.finishColLine(step.line, step.y + 0.5);
        step.next.forEach((next_id, next_index) => {
          step.line.col[next_index] = step.line.col[next_index] || {};
        });
      }
    });
    this.fillColsIndex(cols);
    console.log('test:', test);
    console.log('cols:', cols);
    console.log('lines:', lines);
  }

  createNewColLine = (col, colIndex, start = 1, prev = []) => {
    const line = { col, colIndex, start, end: '', prev, next: [], crossingPoint: [] };
    lines.push(line);
    unfinishedLines.push(line);
    return line;
  }

  /**
   * 生成线分支
   */
  separateColLine = (prevLine, startY, subIndex) => {
    const col = prevLine.col[subIndex];
    const line = {
      col,
      colIndex: `${prevLine.colIndex}${subIndex >= 10 ? subIndex : `0${subIndex}`}`,
      start: startY,
      end: '',
      prev: [prevLine],
      next: [],
      crossingPoint: [],
    };
    prevLine.next.push(line);
    lines.push(line);
    unfinishedLines.push(line);
    return line;
  }

  findBasicLine = (prevLines) => {
    const basicLines = this.findBasicLines({ prev: prevLines });
    let response = basicLines.shift();
    basicLines.forEach((basicLine) => {
      response = basicLine.colIndex - response.colIndex >= 0 ? response : basicLine;
    });
    return response;
  }

  findBasicLines = (line, basicLines = []) => {
    const prevLines = line.prev;
    if (prevLines.length === 0) {
      basicLines.push(line);
    } else if (prevLines.length > 1) {
      prevLines.forEach((prevLine) => {
        basicLines = this.findBasicLines(prevLine, basicLines);
      });
    } else if (prevLines.length === 1) {
      const prevLine = prevLines[0];
      if (prevLine.next.length === 1) {
        basicLines = this.findBasicLines(prevLine, basicLines);
      } else if (prevLine.next.length > 1) {
        let prevNextLine;
        let flag = true;
        const newBasicLines = [...basicLines];
        for (let i = 0; i < prevLine.next.length; i += 1) {
          prevNextLine = prevLine.next[i];
          if (basicLines.indexOf(prevNextLine) === -1 && prevNextLine !== line) {
            basicLines.push(line);
            flag = false;
            break;
          }
          remove(newBasicLines, (item => item === prevNextLine));
        }
        if (flag) {
          basicLines = this.findBasicLines(prevLine, newBasicLines);
        }
      }
    }
    return basicLines;
  }

  finishColLine = (line, endY) => {
    line.end = endY;
    remove(unfinishedLines, item => item === line);
    return line;
  }

  maxColIndex(indexGroup) {
    let max = '0';
    indexGroup.forEach((colIndex) => {
      max = colIndex - max >= 0 ? colIndex : max;
    });
  }

  minColIndex(indexGroup) {
    let min = '1';
    indexGroup.forEach((colIndex) => {
      min = colIndex - min <= 0 ? colIndex : min;
    });
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
