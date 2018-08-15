// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { approvalState } from '../../utils/convert';
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
  all: {
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
  approved: {
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
  deliver: {
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
  rejected: {
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
    const { lists, location: { pathname } } = this.props;
    const { type, page, totalpage } = this.state;
    const currentDatas = lists[`${pathname}_${type}`].datas;
    const { data } = currentDatas;
    return (
      <Start
        dataSource={data}
        page={page}
        totalpage={totalpage}
        onHandleClick={value => this.redirectTo(value)}
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
            tab={approvalState}
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

