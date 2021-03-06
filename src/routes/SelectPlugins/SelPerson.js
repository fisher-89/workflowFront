
// 预提交之后步骤里无可选项的选人
import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { PersonContainer, Nothing } from '../../components/index';
import { Department, Staff, SeStaff, FinalStaff } from '../../common/ListView/index.js';
import { userStorage, isArray, dealCheckAll, getUrlParams, makeFieldValue, setNavTitle } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ searchStaff, loading }) => ({
  searchStaff,
  department: searchStaff.department,
  staff: searchStaff.staff,
  finalStaff: searchStaff.finalStaff,
  searStaff: searchStaff.searStaff,
  breadCrumb: searchStaff.breadCrumb,
  loading1: loading.effects['searchStaff/fetchSearchStaff'],
  loading2: loading.effects['searchStaff/fetchSelfDepStaff'],
  loading3: loading.effects['searchStaff/fetchFirstDepartment'],
  searchLoding: loading.effects['searchStaff/serachStaff'],
}))
export default class SelPerson extends Component {
  constructor(props) {
    super(props);
    const state = this.getInitState();
    this.state = {
      ...state,
    };
  }

  componentWillMount() {
    const { params: { key } } = this.state;
    if (key === 'final') { // 终审人
      this.getFinalStaff();
    } else {
      this.fetchStaffs();
    }
    setNavTitle('选择员工');
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
    this.setState({
      search,
      page: 1,
    });
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (search) {
      this.timer = setInterval(() => {
        this.onSearchSubmit(search);
      }, 500);
    }
  }

  onSearchSubmit = (search) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/serachStaff',
      payload: `page=1&pagesize=15&filters=realname~${search}`,
    });
  }

  onPageChange = () => {
    const { dispatch } = this.props;
    const { page, search } = this.state;
    this.setState({
      page: page + 1,
    });
    dispatch({
      type: 'searchStaff/serachStaff',
      payload: `page=${page + 1}&pagesize=15&status_id>=0&filters=realname~${search};`,
    });
  }

  onRefresh = () => {
    const { search } = this.state;
    this.setState({
      page: 1,
    }, () => {
      this.onSearchSubmit(search.trim());
    });
  }

  getInitState = () => {
    const { searchStaff: { currentKey } } = this.props;
    const urlParams = getUrlParams();
    const paramsValue = urlParams.params;
    const params = JSON.parse(paramsValue);
    const { key, type, max, min } = params;
    const multiple = !!type;
    const current = currentKey[`${key}`] || {};
    const data = current.data || (multiple ? [] : {});
    // const newData = makeFieldValue(data, { value: 'staff_sn', text: 'realname' }, multiple);
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

  getFinalStaff = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/getFinalStaff',
    });
  }

  fetchSelfDepStaff = () => {
    const { dispatch } = this.props;
    const user = userStorage('userInfo');
    dispatch({
      type: 'searchStaff/fetchSelfDepStaff',
      payload: { departmentId: user.department.id },
    });
  }

  fetchSearchStaff = (params) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'searchStaff/fetchSearchStaff',
    //   payload: params,
    // });

    dispatch({
      type: 'searchStaff/fetchFirstDepartment',
      payload: params,
    });
  }

  makeBreadCrumbData = (params) => {
    const { breadCrumb } = this.props;
    let newBread = [...breadCrumb];
    let splitIndex = null;
    newBread.forEach((item, index) => {
      if (item.id === params.id) {
        splitIndex = index + 1;
      }
    });
    if (splitIndex !== null) {
      newBread = newBread.slice(0, splitIndex);
    } else {
      newBread.push(params);
    }
    return newBread;
  }

  selDepartment = (params) => {
    const newBread = this.makeBreadCrumbData(params);
    const parentId = params.id;
    if (parentId === '-1') {
      this.fetchStaffs();
    } else {
      this.fetchSearchStaff({
        // parentId,
        search: `department_id=${parentId}`,
        breadCrumb: newBread,
      });
    }
  }

  checkedAll = (selectAll) => { // 全选
    const { staff } = this.props;
    const staffSn = staff.map(item => item.staff_sn);
    const { selected } = this.state;
    const newSelected = dealCheckAll(selected, staffSn, 'staff_sn', selectAll, staff);
    this.setState({
      selected: newSelected,
    });
  }

  fetchStaffs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchFirstDepartment',
      payload: {
        breadCrumb: [{ name: '联系人', id: '-1' }],
      },
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
      page: 1,
    });
    const { breadCrumb } = this.props;
    if (breadCrumb && breadCrumb.length) {
      this.selDepartment(breadCrumb[breadCrumb.length - 1]);
    } else {
      this.fetchSelfDepStaff();
    }
  }

  // selectOk = () => {
  //   const { dispatch } = this.props;
  //   const { params: { modal, key, type }, selected } = this.state;
  //   const newSelectstaff = selected.data;
  //   dispatch({
  //     type: `${modal}/saveStaff`,
  //     payload: {
  //       key,
  //       type,
  //       value: newSelectstaff,
  //     },
  //   });

  //   // history.goBack(-1);
  // }


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
    // history.goBack(-1);
  }

  render() {
    const {
      department,
      staff, searStaff,
      breadCrumb, loading1,
      loading2, loading3,
      history, location, dispatch,
    } = this.props;
    const someProps = {
      location,
      history,
      dispatch,
    };
    const { selected, search, multiple,
      singleSelected, params: { singleDelete = true, key }, page } = this.state;
    const selectedData = selected.data;
    const isFinal = key === 'final';
    const { totalpage, data = [] } = searStaff;
    const tempFinal = this.onFinalSearch(search);
    const staffSn = staff.map(item => `${item.staff_sn}`);
    const checkAble = selectedData.filter(item =>
      staffSn.indexOf(`${item.staff_sn}`) > -1).length === staffSn.length && staffSn.length;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={multiple}
          name={isFinal ? 'staff_name' : 'realname'}
          singleSelected={singleSelected}
          isFinal={isFinal}
          search={search}
          ableSelectAll={!search}
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.selDepartment}
          fetchDataSource={this.fetchStaffs}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
          handleDelete={this.getSelectResult}
          deleteAble={!!singleDelete}
        >
          <div
            style={{ ...(loading1 || loading2 || loading3 ? { display: 'none' } : null) }}
          >
            {department.length && !search ? (
              <Department
                dataSource={department}
                heightNone
                onRefresh={false}
                hasLoading
                fetchDataSource={this.selDepartment}
                name="id"
              />
            ) : null}
            {((!search && !staff.length && !department.length)) ? <Nothing /> : null}
            {!search && !isFinal ? (
              <Staff
                link=""
                heightNone
                isFinal={isFinal}
                onRefresh={false}
                hasLoading
                name="staff_sn"
                renderName={isFinal ? 'staff_name' : 'realname'}
                multiple={multiple}
                selected={selected.data}
                singleSelected={singleSelected}
                dataSource={staff}
                onChange={this.getSelectResult}
              />
            ) : null}
            {search && !isFinal ? (
              <SeStaff
                {...someProps}
                singleSelected={singleSelected}
                link=""
                isFinal={isFinal}
                name="staff_sn"
                renderName={isFinal ? 'staff_name' : 'realname'}
                page={page}
                totalpage={totalpage}
                onPageChange={this.onPageChange}
                multiple={multiple}
                selected={selected.data}
                dataSource={data}
                onRefresh={this.onRefresh}
                onChange={this.getSelectResult}
              />
            ) : null}
            {isFinal ? (
              <FinalStaff
                link=""
                heightNone
                name="staff_sn"
                dispatch={this.props.dispatch}
                selected={selected.data}
                dataSource={tempFinal}
                onChange={this.getSelectResult}
              />
            ) : null}
          </div>

        </PersonContainer>
      </div>
    );
  }
}
