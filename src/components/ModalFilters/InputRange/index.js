import React from 'react';
import { Flex, InputItem } from 'antd-mobile';
import style from '../index.less';

const defaultValue = {
  min: '',
  max: '',
};

class InputRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value = { min: '', max: '' } } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: {
          min: value.min,
          max: value.max,
        },
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

  handleOnChange = (key, newValue) => {
    const { value } = this.state;
    const { onChange } = this.props;
    this.setState({
      value: {
        ...value,
        [key]: newValue,
      },
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
    const { value: { min, max } } = this.state;
    const { addonBefore } = this.props;
    return (
      <Flex align="center">
        {addonBefore}
        <InputItem
          value={min}
          onChange={v => this.handleOnChange('min', v)}
          // onBlur={(v) => { this.handleOnBlur('min', v); }}
        />
        <span className={style.rg}>—</span>
        <InputItem
          value={max}
          // onBlur={v => this.handleOnBlur('min', v)}
          onChange={v => this.handleOnChange('max', v)}
        />
      </Flex>
    );
  }
}
InputRange.defaultProps = {
  min: null,
  max: null,
  addonBefore: null,
  onChange: () => { },
};
export default InputRange;
