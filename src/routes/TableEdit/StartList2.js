// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { startState } from '../../utils/convert';
import ListControl from '../../components/ListView/ListControl';
import {
  userStorage, dealFlowTypeOptions, getUrlParams,
} from '../../utils/util';
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
        title: '审核环节',
        options: flowTypeOptions,
      },
    ],
  },
  withdraw: {
    filterColumns: [
      {
        name: 'flow_type_id',
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
        name: 'flow_type_id',
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
        name: 'flow_type_id',
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
        name: 'flow_type_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
};
const sortList = [
  { name: '记录时间升序', value: 'created_at-asc', icon: import('../../assets/filter/asc.svg') },
  { name: '记录时间降序', value: 'created_at-desc', icon: import('../../assets/filter/desc.svg') },

];
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
    type: 'all',
    // shortModal: false,
  }

  componentWillMount() {
    const { location: { search } } = this.props;
    const urlParams = getUrlParams(search);
    const { type = 'all' } = urlParams;
    this.setState({
      type,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { location: { search } } = nextProps;
    if (search !== this.props.search) {
      const urlParams = getUrlParams(search || '?type=all');
      const { type } = urlParams;
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
    const { lists, location, history } = this.props;
    const { pathname } = location;
    const { type } = this.state;
    const currentDatas = lists[`${pathname}_${type}`].datas;
    const { data } = currentDatas;
    const someProps = {
      location,
      history,
    };
    return (
      <Start
        dataSource={data}
        // onRefresh={this.onRefresh}
        {...someProps}
        type={type}
        onPageChange={this.onPageChange}

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
            sortList={sortList}
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

