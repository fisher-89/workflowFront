
import React, { Component } from 'react';
import { Flex } from 'antd-mobile';
import ListView from '../../components/ListView';
import { userStorage } from '../../utils/util';

@ListView
export default class Ranking extends Component {
  componentWillMount() {
    this.userInfo = userStorage('userInfo');
  }
  render() {
    const { userInfo } = this;
    const { value, handleClick } = this.props;
    const item = { ...value };

    if (item.staff_sn === userInfo.staff_sn) {
      return (
        <Flex
          justify="between"
          key={item.staff_sn}
          onClick={() => handleClick(value)}
          style={{
            borderBottom: '1px solid rgb(250,250,250)',
            position: 'relative',
            height: '50px',
            padding: '0 0.48rem',
            background: '#fff',

          }}
        >
          <Flex.Item
            style={{ fontSize: '16px', color: 'rgb(24,116,208)' }}
          >
            <span>{item.rank}&nbsp;&nbsp;{item.staff_name}</span>
            <span
              id="my"
              style={{ position: 'absolute', top: '-40px' }}
            >看不见我
            </span>
          </Flex.Item>
          <Flex.Item
            style={{
              color: 'rgb(24,116,208)',
              fontSize: '16px',
              textAlign: 'right',
            }}
          >
            {item.total}
          </Flex.Item>
        </Flex>
      );
    }
    return (
      <Flex
        key={item.staff_sn}
        justify="between"
        style={{
          height: '50px',
          padding: '0 0.48rem',
          borderBottom: '1px solid rgb(250,250,250)',
          background: '#fff',
        }}
        onClick={() => handleClick(value)}
      >
        <Flex.Item
          style={{
            fontSize: '16px',
          }}
        >
          {item.rank}&nbsp;&nbsp;{item.staff_name}
        </Flex.Item>
        <Flex.Item
          style={{
            color: 'rgb(155,155,155)',
            fontSize: '16px',
            textAlign: 'right',
          }}
        >
          {item.total}
        </Flex.Item>
      </Flex>
    );
  }
}

Ranking.defaultProps = {
  handleClick: () => { },
};

