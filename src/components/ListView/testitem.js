import React, { Component } from 'react';
import { connect } from 'dva';
import ListView from './test';

class Item extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'common/getFlowList',
    });
  }
  render() {
    const { items, action } = this.props;
    return (
      <div style={{ height: '30px' }}>
        <div>{items.name}</div>
        <div>
          <span>操作：</span>
          {action.map((item) => {
            return (
              <button
                key={item.name}
                onClick={item.act}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
const EnhanceDemo = ListView(Item);
export default connect(({ common, loading }) => ({ common, loading }))(EnhanceDemo);

