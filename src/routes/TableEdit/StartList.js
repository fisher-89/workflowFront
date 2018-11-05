// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { startState } from '../../utils/convert';
import ListControl from '../../components/ListView/ListControl';
import { userStorage, dealFlowTypeOptions, getUrlParams } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';
import './reset.less';
import { Start } from '../../common/ListView';

const flowList = userStorage('flowList');
const flowTypeOptions = dealFlowTypeOptions(flowList);
const tabs = {
  rejected: {
    filterColumns: [
      {
        name: 'flow_type_id',
        type: 'checkBox',
        multiple: true,
        title: '流程类型',
        options: flowTypeOptions,
      },
      {
        name: 'end_at',
        type: 'timerange',
        title: '驳回时间',
        range: {
          max: moment().format('YYYY-MM-DD'),
          min: '2018-01-01',
        },
      },
      {
        name: 'name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '驳回时间升序', value: 'end_at-asc', icon: '/filter/asc.svg' },
      { name: '驳回时间降序', value: 'end_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'end_at-desc',
    showTime: 'end_at',
  },
  withdraw: {
    filterColumns: [
      {
        name: 'flow_type_id',
        type: 'checkBox',
        multiple: true,
        title: '流程类型',
        options: flowTypeOptions,
      },
      {
        name: 'end_at',
        type: 'timerange',
        title: '撤回时间',
        range: {
          max: moment().format('YYYY-MM-DD'),
          min: '2018-01-01',
        },
      },
      {
        name: 'name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '撤回时间升序', value: 'end_at-asc', icon: '/filter/asc.svg' },
      { name: '撤回时间降序', value: 'end_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'end_at-desc',
    showTime: 'end_at',

  },
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
        name: 'name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '发起升序', value: 'created_at-asc', icon: 'filter/asc.svg' },
      { name: '发起降序', value: 'created_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'created_at-desc',
    showTime: 'created_at',
  },
  finished: {
    filterColumns: [
      {
        name: 'flow_type_id',
        type: 'checkBox',
        title: '流程类型',
        multiple: true,
        options: flowTypeOptions,
      },
      {
        name: 'end_at',
        type: 'timerange',
        title: '完成时间',
        range: {
          max: moment().format('YYYY-MM-DD'),
          min: '2018-01-01',
        },
      },
      {
        name: 'name',
        type: 'search',
        title: '流程名称',
      },
    ],
    sortList: [
      { name: '完成时间升序', value: 'end_at-asc', icon: '/filter/asc.svg' },
      { name: '完成时间降序', value: 'end_at-desc', icon: '/filter/desc.svg' },
    ],
    defaultSort: 'end_at-desc',
    showTime: 'end_at',
  },

};

const searchColumns = {
  name: 'name',
  defaultValue: '',
};
const defaultType = 'processing';
@connect(({ loading, list, common }) => ({
  loading,
  common,
  scrollTopDetails: common.scrollTopDetails,
  lists: list.lists,
}))
export default class StartList extends Component {
  state = {
    type: defaultType,
    // shortModal: false,
  }

  componentWillMount() {
    const { location: { search } } = this.props;
    const urlParams = getUrlParams(search);
    const { type = defaultType } = urlParams;
    this.setState({
      type,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { search } } = nextProps;
    if (search !== this.props.search) {
      const urlParams = getUrlParams(search);
      const { type } = urlParams;
      this.setState({
        type: type || defaultType,
      });
    }
  }

  fetchDataSource = (params) => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    dispatch({
      type: 'list/getStartList',
      payload: {
        parms: {
          ...params,
        },
        path: pathname,
      },
    });
  }

  redirectTo = (item) => {
    const {
      history, location: { pathname, search },
    } = this.props;
    const url = `${pathname}${search}#flag=1`;
    history.replace(url);
    history.push(`/start_detail/${item.id}`);
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
      <Start
        dataSource={data}
        totalpage={totalpage}
        defaultSort={defaultSort}
        offetTop={88}
        {...someProps}
        anchor
        fetchDataSource={this.fetchDataSource}
        type={type}
        timeKey={showTime}
        onPageChange={this.onPageChange}
        onHandleClick={this.redirectTo}
      />
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
            tab={startState}
            sortList={sortList}
            defaultType="processing"
            defaultSort={defaultSort}
            {...someProps}
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

