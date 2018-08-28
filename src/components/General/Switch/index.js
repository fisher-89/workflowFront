import React, { Component } from 'react';
import { Switch } from 'antd-mobile';

export default class SwitchBar extends Component {
  render() {
    return (
      <Switch
        {...getFieldProps('switch', {
            initialValue: true,
            valuePropName: 'checked',
          })}
        onClick={(checked) => { console.log(checked); }}
      />
    );
  }
}
SwitchBar.defaultProps = {
  multiple: false,
};
