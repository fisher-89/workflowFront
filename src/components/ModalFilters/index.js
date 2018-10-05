import React from 'react';
import ListFilter from '../Filter/ListFilter';
import { makerFilters, isArray } from '../../utils/util';
import InputRange from './InputRange';
import CheckBox from './CheckBox';
import PickerRange from './PickerRange';
import InputSearch from './InputSearch';
import ModalSorter from './ModalSorter';
import style from './index.less';

class ModalFilters extends React.Component {
  constructor(props) {
    super(props);
    const { filters, sorter } = props;
    this.state = {
      filters: filters || {},
      sorter: sorter || '',
    };
  }

  componentWillMount() {
    // this.fetchFilters({});
  }

  componentWillReceiveProps(props) {
    const { filters, sorter } = props;
    if (JSON.stringify(filters) !== JSON.stringify(this.props.filters)) {
      this.setState({
        filters: filters || {},
      });
    }
    if (JSON.stringify(sorter) !== JSON.stringify(this.props.sorter)) {
      this.setState({
        sorter: sorter || '',
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchFilters = (params) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { sorter } = this.state;
    const filters = { ...this.state.filters };
    const { fetchDataSource, filterColumns } = this.props;
    const speciPams = [];
    let url = '';
    let newParams = {};
    console.log(filters);
    Object.keys(filters).forEach((key) => {
      const [speciColumn] = filterColumns.filter(item => item.name === key);
      if (speciColumn && speciColumn.notusename) { // 不使用key
        const strValue = filters[key];
        delete filters[key];
        if (speciColumn.notbelong) { // 不放在filters里
          newParams[key] = strValue.in;
        } else {
          speciPams.push(strValue);
        }
      } else if (speciColumn && !speciColumn.notusename) { // 要使用key
        if (speciColumn.notbelong) { // 不放在filters里
          newParams[key] = filters[key].in;
          delete filters[key];
        }
      } else if (Array.isArray(filters[key])) {
        filters[key] = { in: filters[key] };
      }
    });
    newParams = {
      ...newParams,
      sort: sorter,
      filters,
    };
    url = speciPams.join(';');
    newParams = makerFilters(params || newParams);
    newParams.filters += url ? `;${url}` : '';
    fetchDataSource(newParams);
  }

  handleFiltersOnChange = (key, value) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        [key]: value,
      },
    }, () => {
      this.fetchFilters();
    });
  }

  handlesorterOnChange = (sortValue) => {
    this.setState({
      sorter: sortValue,
    }, () => {
      this.fetchFilters();
    });
  }

  handleInputOnChange = (key, value) => {
    const { filters } = this.state;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      filters: {
        ...filters,
        [key]: value,
      },
    }, () => {
      this.timer = setInterval(() => {
        this.fetchFilters();
      }, 500);
    });
  }

  makeRangeFilter = (props) => {
    const { name, min, max } = props;
    const rangaValue = this.state.filters[name];
    return (
      <InputRange
        {...props}
        value={rangaValue}
        min={min}
        max={max}
        // onBlur={value => this.handleFiltersOnChange(name, value)}
        onChange={value => this.handleInputOnChange(name, value)}
      />
    );
  }


  makeCheckFilter = (props) => {
    const { name } = props;
    const keyValue = this.state.filters[name];
    const checkValue = keyValue ? keyValue.in : '';
    const newValue = this.makeCheckBoxValue(checkValue);
    const { options } = props;

    const option = (options || []).map((item) => {
      const obj = { ...item, value: `${item.value || ''}` };
      return obj;
    });

    return (
      <CheckBox
        // {...props}
        options={option}
        value={newValue || []}
        onChange={value => this.handleFiltersOnChange(name, { in: value })}
      />
    );
  }

  makeTimeRangeFilter = (props) => {
    const { name, range } = props;
    const currentValue = this.state.filters[name];
    return (
      <PickerRange
        {...props}
        value={currentValue}
        range={range}
        onChange={value => this.handleFiltersOnChange(name, value)}
      />
    );
  }

  makeInputSearchFilter = (props) => {
    const { name, range } = props;
    const currentValue = this.state.filters[name];
    const newValue = currentValue ? currentValue.like : '';
    return (
      <InputSearch
        {...props}
        value={newValue}
        range={range}
        onChange={value => this.handleInputOnChange(name, { like: value })}
      />
    );
  }


  makeFilterComponent = (item) => {
    let component;
    switch (item.type) {
      case 'range':
        component = this.makeRangeFilter(item);
        break;
      case 'checkBox':
        component = this.makeCheckFilter(item);
        break;
      case 'timerange':
        component = this.makeTimeRangeFilter(item);
        break;
      case 'search':
        component = this.makeInputSearchFilter(item);
        break;
      default:
        break;
    }

    if (!item.title) {
      return (
        <div
          key={item.name}
          className={[style.filter_item, style.range].join(' ')}
          style={{ paddingBottom: '0.48rem' }}
        >
          {component}
        </div>
      );
    }

    return (
      <div
        key={item.name}
        className={[style.filter_item, style.range].join(' ')}
        style={{ paddingBottom: '0.48rem' }}
      >
        <div className={style.title}>{item.title}</div>
        {component}
      </div>
    );
  }

  makeModalProps = () => {
    const { onCancel, visible, onResetForm, top } = this.props;
    const resopnse = {
      onCancel: () => onCancel(false),
      visible,
      top,
      onResetForm: () => {
        this.setState({ filters: {} },
          () => {
            this.fetchFilters();
            onResetForm();
          });
      },
    };
    return resopnse;
  }

  makeCheckBoxValue = (value) => {
    let newValue = '';
    if (isArray(value)) {
      newValue = value.map((item) => {
        return `${item}`;
      });
    } else {
      newValue = `${value || ''}`;
    }
    return newValue;
  }
  renderFiltersComponent = () => {
    const { filterColumns } = this.props;
    const renderFilter = filterColumns.map((item) => {
      return this.makeFilterComponent(item);
    });
    return renderFilter;
  }

  renderFilters = () => {
    return (
      <ListFilter
        {...this.makeModalProps()}
        onOk={() => { this.fetchFilters(); }}
        filterKey="filterModal"
        iconStyle={{ width: '0.533rem', height: '0.533rem' }}
        contentStyle={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          textAlign: 'left',
          backgroundColor: 'rgba(0,0,0,0.2)',
          paddingLeft: '2rem',
        }}
      >
        {this.renderFiltersComponent()}
      </ListFilter>
    );
  }


  render() {
    const { model, sorterData } = this.props;
    return (
      <React.Fragment>
        {model === 'filter' && this.renderFilters()}
        {model === 'sort' && (
          <ModalSorter
            {...this.makeModalProps()}
            data={sorterData}
            onChange={this.handlesorterOnChange}
          />
        )}
      </React.Fragment>
    );
  }
}

ModalFilters.defaultProps = {
  model: 'filter',
  filterColumns: [
    // {
    //   title: '记录时间',
    //   name: 'changed_at',
    //   type: 'timerange',
    //   min: null,
    //   max: moment(new Date()).format('YYYY-MM-DD'),
    // },
    // {
    //   title: '分值类型',
    //   name: 'point_a',
    //   type: 'range',
    //   addonBefore: (
    //     <CheckBoxs
    //       itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
    //       option={[{ name: 'A分', value: 'point_a' }]}
    //     />
    //   ),
    //   min: 1,
    //   max: 10,
    // },
    // {
    //   name: 'point_b',
    //   type: 'range',
    //   addonBefore: (
    //     <CheckBoxs
    //       itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
    //       option={[{ name: 'B分', value: 'point_b' }]}
    //     />
    //   ),
    //   min: 1,
    //   max: 10,
    // },
    // {
    //   name: 'source_id',
    //   type: 'checkBox',
    //   title: '分值来源',
    //   multiple: true,
    //   options: [
    //     {
    //       label: '系统分', value: 0,
    //     },
    //     {
    //       label: '固定分', value: 1,
    //     },
    //     {
    //       label: '奖扣分', value: 2,
    //     },
    //     {
    //       label: '任务分', value: 3,
    //     },
    //     {
    //       label: '考勤分', value: 4,
    //     },
    //     {
    //       label: '日志分', value: 5,
    //     },
    //   ],
    // },
  ],
  sorter: 'created_at-desc',
  sorterData: [],
  filters: {
    // point_a: { min: 1, max: 10 }, point_b: { min: 1, max: 10 }
  },
  onCancel: () => { },
  fetchDataSource: () => { },
};
export default ModalFilters;
