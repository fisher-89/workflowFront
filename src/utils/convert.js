
// 银行类型
// 中国农业银行,中国工商银行,中国建设银行,中国银行,交通银行,招商银行,中国邮政储蓄银行,农村商业银行

import stastic from '../../public/img/stastic.svg';
import stastic_ from '../..//public/img/stastic_.svg';

import home from '../../public/img/home.svg';
import home_ from '../../public/img/home_.svg';

import my from '../../public/img/my.svg';
import my_ from '../../public/img/my_.svg';

import appro from '../../public/img/appro.svg';
import appro_ from '../../public/img/appro_.svg';

import list from '../../public/img/list.svg';
import more from '../../public/img/more.svg';
import application from '../../public/img/application.svg';
// 底部菜单
export const tabbar = [{
  title: '申请',
  key: '',
  to: '/home',
  icon: home_,
  selIcon: home,
}, {
  title: '审批',
  key: 'approval',
  to: '/approvelist?type=processing&page=1',
  icon: appro_,
  selIcon: appro,
}, {
  title: '统计',
  key: 'statistics',
  to: '/statistics',
  icon: stastic_,
  selIcon: stastic,
}, {
  title: '我的',
  key: 'my',
  to: '/my',
  icon: my_,
  selIcon: my,
}];


// 首页入口
export const indexMenu = [{
  src: application,
  title: '申请',
  to: '/add_reimbur',
}, {
  src: list,
  title: '报销单',
  to: '/my_reimbur',
}, {
  src: more,
  title: '其他',
  to: '/add_reimbur',
}];

// 发起状态
export const startState = [
  { title: '处理中', type: 'processing' },
  { title: '已完成', type: 'finished' },
  { title: '被驳回', type: 'rejected' },
  { title: '撤回', type: 'withdraw' },
];
export const startConverSta = [
  { title: '已撤回', type: -2 },
  { title: '被驳回', type: -1 },
  { title: '进行中', value: 0 },
  { title: '已完成', value: 1 },
];
export const getStartState = (state) => {
  switch (state) {
    case -2: return '已撤回';
    case -1: return '被驳回';
    case 0: return '进行中';
    case 1: return '已完成';
    default: return '其他';
  }
};
// 审批状态
export const approvalState = [
  { title: '待审批', type: 'processing' },
  { title: '已审批', type: 'approved' },
  // { title: '已通过', type: 'approved' },
  // { title: '已转交', type: 'deliver' },
  // { title: '已驳回', type: 'rejected' },
];
export const approConverSta = [
  { title: '已驳回', type: -1 },
  { title: '待审批', type: 0 },
  { title: '已通过', value: 2 },
  { title: '已转交', value: 3 },
];

export const getApprState = (state) => {
  switch (state) {
    case -1: return '已驳回';
    case 0: return '待审批';
    case 2: return '已通过';
    case 3: return '已转交';
    default: return '其他';
  }
};
export const reverseState = (state) => {
  switch (state) {
    case 1:
      return '未提交';
    case 2:
      return '处理中';
    case 3:
      return '已完成';
    case 4:
      return '已驳回';
    default:
      return '其他';
  }
};

export const reverseStaffState = (state) => {
  switch (state - 0) {
    case 1:
      return '试用期';
    case 2:
      return '在职';
    case 3:
      return '停薪留职';
    case -1:
      return '离职';
    case -2:
      return '自动离职';
    case -3:
      return '开除';
    case -4:
      return '劝退';
    default:
      return '其他';
  }
};

export function getGridFilter(fields, name, step, flag) {
  return fields.map((item) => {
    let str = '';
    const newFields = [];
    item.fields.forEach((its) => {
      str = `${item.key}.*.${its.key}`;
      if (flag === 1 ? step.hidden_fields.indexOf(str) === -1 && step[name].indexOf(str) === -1 :
        step.hidden_fields.indexOf(str) === -1 && step[name].indexOf(str) !== -1) {
        newFields.push(its);
      }
    });
    return { ...item, newFields };
  });
}

export function dealThumbImg(url, str) {
  const i = url.lastIndexOf('.');
  const newImg = url.slice(0, i) + str + url.slice(i);
  return newImg;
}

export function reAgainImg(url, str) {
  const i = url.lastIndexOf(str);
  const newImg = url.slice(0, i) + url.slice(i + str.length);
  return newImg;
}

export function rebackImg(url, prefix, str) {
  const i = url.lastIndexOf('.');
  const m = prefix.length;
  const n = url.lastIndexOf(str);
  const newImg = url.slice(m, n) + url.slice(i);

  return newImg;
}
