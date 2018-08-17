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
    sortList: [
      { name: '驳回时间升序', value: 'end_at-asc', icon: import('../../assets/filter/asc.svg') },
      { name: '驳回时间降序', value: 'end_at-desc', icon: import('../../assets/filter/desc.svg') },
    ],
    defaultSort: 'end_at-asc',
    showTime: 'end_at',
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
    sortList: [
      { name: '撤回时间升序', value: 'updated_at-asc', icon: import('../../assets/filter/asc.svg') },
      { name: '撤回时间降序', value: 'updated_at-desc', icon: import('../../assets/filter/desc.svg') },
    ],
    defaultSort: 'updated_at-asc',
    showTime: 'updated_at',

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
    sortList: [
      { name: '发起升序', value: 'created_at-asc', icon: import('../../assets/filter/asc.svg') },
      { name: '发起降序', value: 'created_at-desc', icon: import('../../assets/filter/desc.svg') },
    ],
    defaultSort: 'created_at-asc',
    showTime: 'created_at',

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
    sortList: [
      { name: '完成时间升序', value: 'end_at-asc', icon: import('../../assets/filter/asc.svg') },
      { name: '完成时间降序', value: 'end_at-desc', icon: import('../../assets/filter/desc.svg') },
    ],
    defaultSort: 'end_at-asc',
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
      history,
    } = this.props;
    history.push(`/start_detail/${item.id}`);
  }

  renderContent = () => {
    const { lists, location, history } = this.props;
    const urlParams = getUrlParams();
    const { page = 1 } = urlParams;
    const { pathname } = location;
    const { type } = this.state;
    const { showTime } = tabs[type];
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
        // onRefresh={this.onRefresh}
        page={page}
        {...someProps}
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

