import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { PersonContainer, Nothing } from '../../components/index';
import { Department, Staff, SeStaff } from '../../common/ListView/index.js';
import { makeFieldValue } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ formSearchStaff, loading }) => ({
  formSearchStaff,
  department: formSearchStaff.department,
  staff: formSearchStaff.staff,
  finalStaff: formSearchStaff.finalStaff,
  searStaff: formSearchStaff.searStaff,
  breadCrumb: formSearchStaff.breadCrumb,
  loading3: loading.effects['formSearchStaff/fetchFirstDepartment'],
  searchLoding: loading.effects['formSearchStaff/serachStaff'],
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
    this.fetchDataSource();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onSearch = (search) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.onSearchSubmit(search);
    }, 500);
  }

  onSearchSubmit = (search) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { match: { params } } = this.props;
    const { fieldId } = params;
    const currentParams = {
      field_id: fieldId,
      page: 1,
      pagesize: 15,
      filters: {
        realname: { like: search },
      },
    };

    this.setState({
      search,
    }, () => {
      this.fetchPageDataSource(currentParams);
    });
  }

  onPageChange = () => {
    const { searStaff, match: { params } } = this.props;
    const { search } = this.state;
    const { page } = searStaff;
    const { fieldId } = params;
    const currentParams = {
      field_id: fieldId,
      page: page + 1,
      pagesize: 15,
      filters: {
        realname: { like: search },
      },
    };
    this.fetchPageDataSource(currentParams);
  }

  onRefresh = () => {
    const { search } = this.state;
    this.onSearchSubmit(search);
  }

  getSelectResult = (result) => {
    const { selected, type } = this.state;
    if (type !== '1') {
      this.getSingleSelect(result);
    } else {
      const newResult = result.map((item) => {
        const obj = { ...item };
        obj.staff_name = item.realname || item.staff_name;
        return obj;
      });
      this.setState({
        selected: {
          ...selected,
          data: newResult,
          num: newResult.length,
        },
      });
    }
  }

  getSingleSelect = (result) => {
    const { key } = this.state;
    const { history, formSearchStaff: { currentKey }, dispatch } = this.props;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const newSelectstaff = [result];
    const formSelectedStaff = this.makeFormStaff(newSelectstaff);
    if (cb) {
      cb(formSelectedStaff);
    }
    dispatch({
      type: 'formSearchStaff/saveSelectStaff',
      payload: {
        key,
        value: formSelectedStaff,
      },
    });
    history.goBack(-1);
  }

  getInitState = () => {
    const { match: { params }, formSearchStaff: { currentKey } } = this.props;
    const { key, type } = params;
    const current = currentKey[`${key}`] || {};
    const { data = [] } = current;
    const newData = makeFieldValue(data, { staff_name: 'realname' }, true);
    const obj = {
      selected: {
        data: newData,
        total: 50,
        num: newData.length,
      },
      selectAll: false,
      search: '',
      key, // 选的什么人
      type, // 选的类型，单选还是多选
    };
    return obj;
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

  selDepartment = (data) => {
    const { match: { params } } = this.props;
    const { fieldId } = params;
    const newBread = this.makeBreadCrumbData(data);
    const parentId = data.id;
    this.setState({
      selectAll: false,
    });
    let payload = null;
    if (`${parentId}` !== '-1') {
      payload = {
        breadCrumb: newBread,
        reqData: { field_id: fieldId, department: parentId },
      };
    }
    this.fetchDataSource(payload);
  }

  fetchDataSource = (payload) => {
    const { dispatch, match: { params } } = this.props;
    const { fieldId } = params;
    let newParams = {};
    if (payload) {
      newParams = { ...payload };
    } else {
      newParams = {
        breadCrumb: [{ name: '联系人', id: '-1' }],
        reqData: { field_id: fieldId },
      };
    }
    dispatch({
      type: 'formSearchStaff/fetchFirstDepartment',
      payload: { ...newParams },
    });
  }

  fetchPageDataSource = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'formSearchStaff/serachStaff',
      payload: params,
    });
  }

  checkedAll = () => { // 全选
    const { staff } = this.props;
    const staffSn = staff.map(item => item.staff_sn);
    const { selectAll, selected } = this.state;
    const { data } = selected;
    if (selectAll) {
      const newData = data.filter(item => staffSn.indexOf(item.staff_sn) === -1);
      selected.data = newData;
      selected.num = newData.length;
    } else {
      const newData = [...data, ...staff];
      const result = [];
      const obj = {};
      for (let i = 0; i < newData.length; i += 1) {
        if (!obj[newData[i].staff_sn]) { // 如果能查找到，证明数组元素重复了
          obj[newData[i].staff_sn] = 1;
          result.push(newData[i]);
        }
      }
      selected.data = result;
      selected.num = result.length;
    }
    selected.total = 50;

    this.setState({
      selected,
      selectAll: !selectAll,
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
    });
    const { breadCrumb } = this.props;
    if (breadCrumb && breadCrumb.length) {
      this.selDepartment(breadCrumb[breadCrumb.length - 1]);
    } else {
      this.fetchSelfDepStaff();
    }
  }

  makeFormStaff = (newSelectstaff) => {
    const selectedStaff = newSelectstaff.map((item) => {
      const obj = {};
      obj.staff_name = item.realname;
      obj.staff_sn = item.staff_sn;
      return obj;
    });
    return selectedStaff;
  }

  selectOk = () => {
    const { match: { params }, history, formSearchStaff: { currentKey }, dispatch } = this.props;
    const { key } = params;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const { selected } = this.state;
    const newSelectstaff = selected.data;
    const formSeletedStaff = this.makeFormStaff(newSelectstaff);
    if (cb) {
      cb(formSeletedStaff);
    }
    dispatch({
      type: 'formSearchStaff/saveSelectStaff',
      payload: {
        key,
        value: formSeletedStaff,
      },
    });
    history.goBack(-1);
  }

  render() {
    const {
      department,
      staff, searStaff,
      breadCrumb,
      loading3,
      history, location,
    } = this.props;
    const someProps = {
      location,
      history,
    };
    const { selected, type, search, key, selectAll } = this.state;
    const selectedData = selected.data;
    const { page, totalpage, data = [] } = searStaff;
    const staffSn = staff.map(item => item.staff_sn);
    const checkAble = selectedData.filter(item =>
      staffSn.indexOf(item.staff_sn) > -1).length === staffSn.length && selectAll;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={type === '1'}
          name="realname"
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.selDepartment}
          fetchDataSource={() => this.fetchDataSource()}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
        >
          <div
            style={{ ...(loading3 ? { display: 'none' } : null) }}
          >
            {department.length && !search ? (
              <Department
                onRefresh={false}
                dataSource={department}
                heightNone
                fetchDataSource={this.selDepartment}
                name="id"
              />
            ) : null}
            {search && data && !data.length ? <Nothing /> : null}
            {!search && staff.length ? (
              <Staff
                link=""
                heightNone
                onRefresh={false}
                name="staff_sn"
                renderName="realname"
                dispatch={this.props.dispatch}
                multiple={type === '1'}
                selected={selected.data}
                dataSource={staff}
                onChange={this.getSelectResult}
              />
            ) : null}
            {search ? (
              <SeStaff
                {...someProps}
                type={key}
                link=""
                heightNone
                name="staff_sn"
                renderName="realname"
                page={page}
                totalpage={totalpage}
                onPageChange={this.onPageChange}
                dispatch={this.props.dispatch}
                multiple={type === '1'}
                selected={selected.data}
                dataSource={data}
                onRefresh={this.onRefresh}
                onChange={this.getSelectResult}
              />
            ) : null}

          </div>

        </PersonContainer>
      </div>
    );
  }
}
