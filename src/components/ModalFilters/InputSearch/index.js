import React from 'react';
import { Flex, InputItem } from 'antd-mobile';

const defaultValue = '';

class InputRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value,
      });
    }
  }

  makeInputValue = (newValue) => {
    let value = newValue;
    const { range, type } = this.props;
    if (type === 'number' && range) {
      if (parseFloat(value) < range.min) {
        value = range.min;
      }
      if (parseFloat(value) > range.max) {
        value = range.max;
      }
    }
    const numberValue = parseFloat(value);
    if (Math.floor(numberValue) === numberValue) {
      value = Number(value);
    }
    return value;
  }

  handleOnChange = (value) => {
    const { onChange } = this.props;
    this.setState({
      value,
    }, () => {
      onChange(this.state.value);
    });
  }

  handleOnBlur = (key, newValue) => {
    const { value } = this.state;
    const { onBlur } = this.props;
    let nowValue = newValue;
    if (!/^(-?\d+)(\.\d+)?$/.test(newValue)) {
      nowValue = Number(newValue);
    }
    this.setState({
      value: {
        ...value,
        [key]: nowValue,
      },
    }, () => {
      onBlur(this.state.value);
    });
  }

  render() {
    const { value } = this.state;
    const { addonBefore } = this.props;
    return (
      <Flex align="center">
        {addonBefore}
        <InputItem
          value={value}
          onChange={this.handleOnChange}
          // onBlur={(v) => { this.handleOnBlur('min', v); }}
        />

      </Flex>
    );
  }
}
InputRange.defaultProps = {
  search: '',
  addonBefore: null,
  onChange: () => { },
};
export default InputRange;
