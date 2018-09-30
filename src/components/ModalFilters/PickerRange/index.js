import React from 'react';
import { DatePicker, Flex } from 'antd-mobile';
import moment from 'moment';
import style from '../index.less';

// const defaultValue = {
//   min: '',
//   max: moment(new Date()).format('YYYY-MM-DD'),
// };
class PickerRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || {},
      // focus: 'start_at',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: value || {},
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
    const { addonBefore, range } = this.props;
    const valueMax = max ? max.replace(/-/g, '/') : '';
    const valueMin = min ? min.replace(/-/g, '/') : '';
    const rangeMax = (range.max || '').replace(/-/g, '/');
    const rangeMin = (range.min || '').replace(/-/g, '/');
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
            value={valueMin ? new Date(valueMin) : undefined}
            format="YYYY-MM-DD"
            maxDate={rangeMax ? new Date(rangeMax) : undefined}
            minDate={rangeMin ? new Date(rangeMin) : undefined}
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
            value={valueMax ? new Date(valueMax) : undefined}
            format="YYYY-MM-DD"
            minDate={rangeMin ? new Date(rangeMin) : undefined}
            maxDate={rangeMax ? new Date(rangeMax) : undefined}
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
