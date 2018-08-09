import React from 'react';
import { DatePicker, Flex } from 'antd-mobile';
import moment from 'moment';
import style from '../index.less';

const defaultValue = {
  min: '',
  max: moment(new Date()).format('YYYY-MM-DD'),
};
class PickerRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || defaultValue,
      // focus: 'start_at',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: value || defaultValue,
      });
    }
  }

  handleOnChange = (key, newValue) => {
    const { value } = this.state;
    const { onChange } = this.props;
    this.setState({
      value: {
        ...value,
        [key]: moment(newValue).format('YYYY-MM-DD'),
      },
    }, () => {
      onChange(this.state.value);
    });
  }

  render() {
    const { value: { min, max } } = this.state;
    const { addonBefore } = this.props;
    const valueMax = max.replace(/-/g, '/');
    const valueMin = min.replace(/-/g, '/');
    return (
      <Flex
        className={style.pickerange}
      >
        {addonBefore}
        <Flex.Item
          style={{ flex: '1 1' }}
        >
          <DatePicker
            mode="date"
            value={new Date(valueMin)}
            format="YYYY-MM-DD"
            maxDate={new Date()}
            onChange={date => this.handleOnChange('min', date)}
          >
            <div className={style.some_time}>{min}</div>
          </DatePicker>
        </Flex.Item>
        <Flex.Item
          style={{ flex: '1 1' }}

        >
          <DatePicker
            mode="date"
            value={new Date(valueMax)}
            format="YYYY-MM-DD"
            maxDate={new Date()}
            onChange={date => this.handleOnChange('max', date)}
          >
            <div className={style.some_time}>{max}</div>
          </DatePicker>
        </Flex.Item>
      </Flex>

    );
  }
}
PickerRange.defaultProps = {
  min: null,
  max: null,
  addonBefore: null,
  onChange: () => { },
};

export default PickerRange;
