import React, { Component } from 'react';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ListView from '../../components/ListView';

@ListView
@connect()
export default class Group extends Component {
  redirect=() => {
    const { datetime, value, dispatch, url, stage = 'month' } = this.props;
    dispatch(routerRedux.push(`${url}?group_id=${value.id}&datetime=${datetime}&stage=${stage}`));
  }
  render() {
    const { value } = this.props;
    return (
      <List.Item
        arrow="horizontal"
        onClick={() => this.redirect()}
      >{value.name}
      </List.Item>
    );
  }
}

