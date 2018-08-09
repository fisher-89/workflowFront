// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import filterImg from '../../assets/filter.svg';
import { startState } from '../../utils/convert';
// import { parseParams } from '../../utils/util';
// userStorage, dealFlowTypeOptions ,
import styles from '../common.less';
import style from './index.less';
import './reset.less';
import { Start } from '../../common/ListView';

// { title: '全部', type: 'all' },
//   { title: '已完成', type: 'finished' },
//   { title: '处理中', type: 'processing' },
//   { title: '被驳回', type: 'rejected' },
//   { title: '撤回', type: 'withdraw' },
// const flowList = userStorage('flowList');
// const flowTypeOptions = dealFlowTypeOptions(flowList);
// const tabs = {
//   processing: {
//     filterColumns: [
//       {
//         name: 'status_id',
//         type: 'checkBox',
//         title: '审核环节',
//         options: flowTypeOptions,
//       },
//     ],
//   },
// };
@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class StartList extends Component {
  state = {
  }
  componentWillMount() {
    // this.flowList = userStorage('flowList');
    console.log(this.props);
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'list/getStartList',
      payload: {
        parms: {
          type: 'all',
          page: 1,
        },
        path: 'start_list2',
      },
    });
  }

  fecthDataSource = (params) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'list/getStartList',
      payload: {
        parms: {
          ...params,
        },
        path: 'start_list2',
      },
    });
  }

  statusChange = (tab) => { // tab切换
    const { history, lists, location: { pathname } } = this.props;
    const { type } = tab;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;
    console.log(current, tab);
    const newUrl = url ? `?${url}` : '';
    history.replace(`/start_list2${newUrl}`);
  }

  selFilter = (feild) => { // 筛选
    const {
      dispatch,
    } = this.props;
    this.setState({
      [feild]: !this.state[feild],
    }, () => {
      dispatch({
        type: 'common/save',
        payload: {
          key: 'footStyle',
          value: {
            display: 'none',
          },
        },
      });
    });
  }

  renderContent = () => {
    // const { lists } = this.props;
    return (
      <Start dataSource={[]} />
    );
  }

  render() {
    return (
      <div className={styles.con}>
        <div className={style.con_list}>
          <Tabs
            tabs={startState}
            renderTabBar={props => (
              <Tabs.DefaultTabBar
                {...props}
                page={4}
              />
            )}
            onChange={this.statusChange}
            initialPage={0}
          >
            {this.renderContent(this.state.type)}
          </Tabs>
          <div className={style.img}>
            <i />
            <img
              src={filterImg}
              style={{ width: '0.533rem', height: '0.533rem' }}
              alt=""
              onClick={() => this.selFilter('visible')}
            />
          </div>
        </div>
      </div>
    );
  }
}

