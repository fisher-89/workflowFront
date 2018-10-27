import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { PersonContainer, Nothing } from '../../components/index';
import { Staff } from '../../common/ListView/index.js';
import { isArray, dealCheckAll, getUrlParams, makeFieldValue } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ searchStaff }) => ({
  searchStaff,
}))
export default class SelPerson extends Component {
  constructor(props) {
    super(props);
    const state = this.getInitState();
    this.state = {
      ...state,
    };
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onFinalSearch = (search) => {
    const { finalStaff } = this.props;
    let newFinalStaff = null;
    if (isArray(finalStaff)) {
      newFinalStaff = finalStaff.filter(item => item.staff_name.indexOf(search) > -1);
    } else {
      newFinalStaff = [];
    }
    return newFinalStaff;
  }

  onSearch = (search = '') => {
    const { dataSource } = this.state;
    let result = null;
    if (isArray(dataSource)) {
      result = dataSource.filter(item => item.realname.indexOf(search) > -1);
    } else {
      result = [];
    }
    this.setState({
      search,
      ableSource: search ? result : dataSource,
    });
  }

  getInitState = () => {
    const { searchStaff: { currentKey } } = this.props;
    const urlParams = getUrlParams();
    const paramsValue = urlParams.params;
    const params = JSON.parse(paramsValue);
    const { key, type, max, min, dataSource } = params;
    const multiple = !!type;
    const current = currentKey[`${key}`] || {};
    const data = current.data || (multiple ? [] : {});
    // const newData = makeFieldValue(data, { value: 'staff_sn', text: 'realname' }, multiple);
    console.log('current', current);

    let newData = [];
    if (!multiple && !Object.keys(data || {}).length) {
      newData = {};
    } else {
      newData = makeFieldValue(data, { value: 'staff_sn', text: 'realname' }, multiple);
    }
    let mutiData = [];
    if (multiple) {
      mutiData = newData;
    }
    const singleSelected = multiple ? {} : newData;
    const obj = {
      selected: {
        data: mutiData,
        total: max || 50,
        num: mutiData.length,
        min: min || 1,
      },
      dataSource,
      ableSource: dataSource,
      singleSelected,
      params,
      page: 1,
      search: '',
      // key, // 选的什么人
      // type, // 选的类型，单选还是多选
      multiple,
    };
    return obj;
  }

  getSelectResult = (result) => {
    const { selected, multiple } = this.state;
    if (!multiple) {
      this.getSingleSelect(result);
    } else {
      this.setState({
        selected: {
          ...selected,
          data: result,
          num: result.length,
        },
      });
    }
  }

  getSingleSelect = (result) => {
    const { searchStaff: { currentKey } } = this.props;
    const { params: { key } } = this.state;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    if (cb) {
      cb(result);
    }
  }

  checkedAll = (selectAll) => { // 全选
    // const { staff } = this.props;
    const staff = this.state.ableSource;
    const staffSn = staff.map(item => item.staff_sn);
    const { selected } = this.state;
    const newSelected = dealCheckAll(selected, staffSn, 'staff_sn', selectAll, staff);
    this.setState({
      selected: newSelected,
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
      ableSource: this.state.dataSource,
    });
  }

  selectOk = () => {
    const { searchStaff: { currentKey } } = this.props;
    const { params, selected } = this.state;
    const { key } = params;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const newSelectstaff = selected.data;
    if (cb) {
      cb(newSelectstaff);
    }
  }

  render() {
    const { selected, search, multiple,
      singleSelected, params: { singleDelete = true }, ableSource } = this.state;
    const selectedData = selected.data;
    console.log('selectedData', selectedData);
    const staffSn = ableSource.map(item => `${item.staff_sn}`);
    const checkAble = selectedData.filter(item =>
      staffSn.indexOf(`${item.staff_sn}`) > -1).length === staffSn.length && staffSn.length;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={multiple}
          name="realname"
          singleSelected={singleSelected}
          search={search}
          ableSelectAll={!search}
          checkAble={checkAble}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          fetchDataSource={this.fetchStaffs}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
          handleDelete={this.getSelectResult}
          deleteAble={!!singleDelete}
        >
          {!ableSource.length ? <Nothing /> : null}
          <Staff
            link=""
            heightNone
            onRefresh={false}
            name="staff_sn"
            renderName="realname"
            multiple={multiple}
            selected={selectedData}
            singleSelected={singleSelected}
            dataSource={ableSource}
            onChange={this.getSelectResult}
          />
        </PersonContainer>
      </div>
    );
  }
}
