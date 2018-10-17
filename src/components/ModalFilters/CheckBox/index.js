import React from 'react';
import { Toast } from 'antd-mobile';
import Styles from './index.less';
import { isArray } from '../../../utils/util';

class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, multiple } = props;
    let newValue = [];
    if (!(value instanceof Array) && multiple) {
      newValue = [value];
    } else {
      newValue = value || (multiple ? [] : []);
    }
    this.state = {
      value: newValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, multiple } = nextProps;

    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      let newValue = [];
      newValue = value || (multiple ? [] : '');
      this.setState({ value: newValue });
    }
  }

  handleOnChange = (changeValue) => {
    const { onChange, multiple, range: { max } } = this.props;
    let value = changeValue;
    if (multiple) {
      const stateValue = this.state.value;
      const isarray = isArray(stateValue);
      let newValue = isarray ? [...this.state.value] : [stateValue];
      let pushAble = true;
      newValue.forEach((item) => {
        if (`${changeValue}` === `${item}`) {
          pushAble = false;
        }
      });
      if (pushAble) {
        const { length } = newValue;
        if (max > 0 && length - max >= 0) {
          Toast.info(`最多选择${max}项`, 1);
        } else {
          newValue.push(changeValue);
        }
      } else {
        newValue = newValue.filter(item => `${changeValue}` !== `${item}`);
      }
      value = newValue;
    }
    this.setState({
      value,
    }, () => {
      onChange(value);
    });
  }

  render() {
    const {
      options,
      readonly,
      style,
      multiple,
    } = this.props;
    // const currentValue = this.state.value;
    // let value = currentValue;
    // if (multiple) {
    //   value = (currentValue || []).map(item => `${item}`);
    // }
    const { value } = this.state;
    return (
      <div className={Styles.check_status}>
        {options.map((option) => {
          let checked = false;
          const checkValue = option.value || option;
          if (multiple) {
            checked = value.indexOf(`${checkValue}`) !== -1;
          } else {
            checked = `${value}` === `${checkValue}`;
          }
          const className = [Styles.s_item, checked ? Styles.active : null, readonly ? Styles.readonly : null].join(' ');
          const itemStyle = { display: readonly && !checked ? 'none' : '', ...style };
          return (
            <div
              key={option.value}
              className={className}
              style={itemStyle}
              onClick={() => this.handleOnChange(option.value || option)}
            >
              {option.label ? option.label : option}
            </div>
          );
        })
        }
      </div>
    );
  }
}
CheckBox.defaultProps = {
  readonly: false,
  multiple: true,
  options: [],
  style: {},
  range: {
    max: '', min: '',
  },
  onChange: () => { },
};
export default CheckBox;
