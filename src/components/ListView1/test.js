import React, { Component } from 'react';

export default function ListView(WrappedComponent) {
  return class HOC extends Component {
    render() {
      const { common } = this.props;
      const { flowList } = common;
      const action = [
        {
          name: '删除',
          act: () => {},
        },
        {
          name: '添加',
          act: () => {},
        },
        {
          name: '编辑',
          act: () => {},
        },
      ];
      return (
        <div>
          {
          flowList.map((item, idx) => {
            const prop = {
              items: item,
            };
            const i = idx;
            return (
              <WrappedComponent
                key={i}
                {...prop}
                action={action}
                dispatch={this.props.dispatch}
              />
);
          })
        }
        </div>
      );
    }
  };
}

