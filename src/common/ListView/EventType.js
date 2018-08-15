import React, { Component } from 'react';
import { List } from 'antd-mobile';
import ListView from '../../components/ListView';

const { Item } = List;
@ListView
export default class EventType extends Component {
  render() {
    const { value, fetchDataSource, name } = this.props;
    if (value) {
      return (
        <Item
          arrow="horizontal"
          onClick={() => fetchDataSource(value)}
        >
          {value[name]}
        </Item>
      );
    }
  }
}
EventType.defaultProps = {
  multiple: false,
};
