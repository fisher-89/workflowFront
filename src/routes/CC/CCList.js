// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import ListControl from '../../components/ListView/ListControl';
import styles from '../common.less';
import style from '../Approved/index.less';
import '../Approved/reset.less';
import { CC } from '../../common/ListView';
import { setNavTitle } from '../../utils/util';

const defaultType = 'all';
const tabs = {
  all: {
    filterColumns: [
      {
        name: 'created_at',
        type: 'timerange',
        title: '抄送时间',
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
    defaultSort: 'created_at-desc',
    showTime: 'created_at',
  },

};
const searchColumns = {
  name: 'flow_name',
  defaultValue: '',
};
setNavTitle('抄送列表');

@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class CCList extends Component {
  state = {
    type: defaultType,
  }

  fetchDataSource = (params) => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    dispatch({
      type: 'list/getCCList',
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
    history.push(`/cc_detail/${item.id}`);
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
      <CC
        totalpage={totalpage}
        timeKey={showTime}
        defaultSort={defaultSort}
        dataSource={data}
        offetTop={44}
        anchor
        fetchDataSource={this.fetchDataSource}
        type={type}
        {...someProps}
        onHandleClick={value => this.redirectTo(value)}
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
            // tab={approvalState}
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

