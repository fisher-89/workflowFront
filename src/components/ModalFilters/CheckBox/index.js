import React from 'react';
import Styles from './index.less';

class CheckBox extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value, multiple } = props;
    const newValue = value || (multiple ? [] : []);
    this.state = {
      value: newValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({ value });
    }
  }

  handleOnChange = (changeValue) => {
    const { onChange, multiple } = this.props;
    if (multiple) {
      let newValue = [...this.state.value];
      let pushAble = true;
      newValue.forEach((item) => {
        if (changeValue === item) {
          pushAble = false;
        }
      });
      if (pushAble) {
        newValue.push(changeValue);
      } else {
        newValue = newValue.filter(item => changeValue !== item);
      }
      onChange(newValue);
      return;
    }
    onChange(changeValue);
  }

  render() {
    const {
      options,
      readonly,
      style,
      multiple,
    } = this.props;
    const { value } = this.state;
    const itemStyle = { display: readonly && !checked ? 'none' : '', ...style };
    return (
      <div className={Styles.check_status}>
        {options.map((option) => {
          let checked = false;
          const checkValue = option.value || option;
          if (multiple) {
            checked = value.indexOf(checkValue) !== -1;
          } else {
            checked = value === checkValue;
          }
          const className = [Styles.s_item, checked ? Styles.active : null].join(' ');
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
  onChange: () => { },
};
export default CheckBox;
