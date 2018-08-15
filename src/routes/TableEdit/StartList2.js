// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { startState } from '../../utils/convert';
import ListControl from '../../components/ListView/ListControl';
import {
  userStorage, dealFlowTypeOptions,
} from '../../utils/util';
import styles from '../common.less';
import style from './index.less';
import './reset.less';
import { Start } from '../../common/ListView';

const flowList = userStorage('flowList');
const flowTypeOptions = dealFlowTypeOptions(flowList);
const tabs = {
  processing: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        multiple: true,
        title: '审核环节',
        options: flowTypeOptions,
      },
    ],
  },
  finished: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
  all: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
};
const searchColumns = {
  name: 'name',
  defaultValue: '',
};
@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class StartList extends Component {
  state = {
    page: 1,
    totalpage: 10,
    type: 'all',
    // shortModal: false,
  }

  // onRefresh = () => {
  //   const { history, location: { pathname, search } } = this.props;
  //   history.replace();
  // }

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
      history,
    } = this.props;
    history.push(`/start_detail/${item.id}`);
  }

  renderContent = () => {
    const { lists, location: { pathname } } = this.props;
    const { type, page, totalpage } = this.state;
    const currentDatas = lists[`${pathname}_${type}`].datas;
    const { data } = currentDatas;
    return (
      <Start
        dataSource={data}
        // onRefresh={this.onRefresh}
        page={page}
        totalpage={totalpage}
        onHandleClick={this.redirectTo}
      />
    );
  }

  render() {
    const { location, history } = this.props;
    const { type } = this.state;
    const { filterColumns } = tabs[type];
    const someProps = {
      location,
      history,
    };
    return (
      <div className={styles.con}>
        <div className={style.con_list}>
          <ListControl
            tab={startState}
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

