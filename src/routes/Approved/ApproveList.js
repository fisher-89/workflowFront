// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { approvalState } from '../../utils/convert';
import ListControl from '../../components/ListView/ListControl';
import {
  userStorage, getUrlParams, dealFlowTypeOptions,
} from '../../utils/util';
import styles from '../common.less';
import style from './index.less';
import './reset.less';
import { Approve, Pending } from '../../common/ListView';

const approveState = [
  { label: '已驳回', value: -1 },
  { label: '已通过', value: 2 },
  { label: '已转交', value: 3 },
];
const flowList = userStorage('flowList');
const flowTypeOptions = dealFlowTypeOptions(flowList);
const defaultType = 'processing';
const tabs = {
  processing: {
    filterColumns: [
      {
        name: 'flow_type_id',
        type: 'checkBox',
        multiple: true,
        title: '流程类型',
        options: flowTypeOptions,
      },
      {
        name: 'created_at',
        type: 'timerange',
        title: '发起时间',
        range: {
          max: moment().format('YYYY-MM-DD'),
          min: '2018-01-01',
        },
      },
      {
        name: 'flow_name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '发起时间升序', value: 'created_at-asc', icon: '/filter/asc.svg' },
      { name: '发起时间降序', value: 'created_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'created_at-asc',
    showTime: 'created_at',
  },
  approved: {
    filterColumns: [
      {
        name: 'flow_type_id',
        type: 'checkBox',
        title: '流程类型',
        multiple: true,
        options: flowTypeOptions,
      },
      {
        name: 'action_type',
        type: 'checkBox',
        multiple: true,
        title: '状态',
        options: approveState,
      },
      {
        name: 'acted_at',
        type: 'timerange',
        title: '审批时间',
        range: {
          max: moment().format('YYYY-MM-DD'),
          min: '2018-01-01',
        },
      },
      {
        name: 'flow_name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '发起时间升序', value: 'acted_at-asc', icon: '/filter/asc.svg' },
      { name: '发起时间降序', value: 'acted_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'acted_at-desc',
    showTime: 'acted_at',
  },
};
const searchColumns = {
  name: 'flow_name',
  defaultValue: '',
};
@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class StartList extends Component {
  state = {
    type: defaultType,
    // shortModal: false,
  }
  componentWillReceiveProps(nextProps) {
    const { location: { search } } = nextProps;
    if (search !== this.props.search) {
      const urlParams = getUrlParams(search);
      const { type = defaultType } = urlParams;
      this.setState({
        type,
      });
    }
  }

  fetchDataSource = (params) => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    dispatch({
      type: 'list/getApproList',
      payload: {
        parms: {
          ...params,
        },
        path: pathname,
      },
    });
  }

  redirectTo = (item) => {
    const { history } = this.props;
    history.push(`/approve/${item.id}`);
  }

  renderContent = () => {
    const { lists, location, history } = this.props;
    const { pathname } = location;
    const { type } = this.state;
    const { showTime, defaultSort } = tabs[type];
    const currentDatas = lists[`${pathname}_${type}`].datas;
    const { totalpage, data } = currentDatas;
    const someProps = {
      location,
      history,
    };
    return (
      type === 'approved' ? (
        <Approve
          totalpage={totalpage}
          timeKey={showTime}
          defaultSort={defaultSort}
          dataSource={data}
          fetchDataSource={this.fetchDataSource}
          type={type}
          {...someProps}
          onHandleClick={value => this.redirectTo(value)}
        />) : (
          <Pending
            totalpage={totalpage}
            timeKey={showTime}
            defaultSort={defaultSort}
            dataSource={data}
            fetchDataSource={this.fetchDataSource}
            type={type}
            {...someProps}
            onHandleClick={value => this.redirectTo(value)}
          />
      )
    );
  }

  render() {
    const { location, history } = this.props;
    const { type } = this.state;
    const { filterColumns, sortList, defaultSort } = tabs[type];
    const someProps = {
      location,
      history,
    };
    return (
      <div className={styles.con}>
        <div className={style.con_list}>
          <ListControl
            tab={approvalState}
            {...someProps}
            type={type}
            defaultType={defaultType}
            sortList={sortList}
            defaultSort={defaultSort}
            filterColumns={filterColumns}
            searchColumns={searchColumns}
            handleFetchDataSource={this.fetchDataSource}
          >
            {this.renderContent()}
          </ListControl>
        </div>
      </div>
    );
  }
}

