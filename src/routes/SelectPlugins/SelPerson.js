import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { PersonContainer, Nothing } from '../../components/index';
import { Department, Staff, SeStaff, FinalStaff } from '../../common/ListView/index.js';
import { userStorage, isArray, dealCheckAll } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ searchStaff, loading }) => ({
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
  state = {
    selected: {
      data: [],
      total: 50,
      num: 0,
    },
    selectAll: false,
    search: '',
    key: '', // 选的什么人
    type: 1, // 选的类型，单选还是多选
    page: 1,
  };

  componentWillMount() {
    const { match: { params } } = this.props;
    const { key, type } = params;
    // const key = analyzePath(this.props.location.pathname, 1);
    // const type = analyzePath(this.props.location.pathname, 2);
    if (key === 'final') { // 终审人
      this.getFinalStaff();
    } else {
      this.fetchSelfDepStaff();
    }
    this.setState({
      key,
      type,
    });
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
      payload: `page=1&pagesize=15&filters=realname~${search};status_id>=0`,
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
      payload: `page=${page + 1}&pagesize=15&status_id>=0&filters=realname~${search};status_id>=0`,
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

  getSelectResult = (result) => {
    const { selected, type } = this.state;
    if (`${type}` !== '1') {
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
    const { dispatch, history, match: { params } } = this.props;
    const { modal } = params;
    const { key, type } = this.state;
    dispatch({
      type: `${modal}/saveStaff`,
      payload: {
        key,
        type,
        value: result,
      },
    });
    history.goBack(-1);
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
    dispatch({
      type: 'searchStaff/fetchSearchStaff',
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
    this.setState({
      selectAll: false,
    });
    if (parentId === '-1') {
      this.firstDepartment();
    } else {
      this.fetchSearchStaff({
        parentId,
        breadCrumb: newBread,
      });
    }
  }

  checkedAll = () => { // 全选
    const { staff } = this.props;
    const staffSn = staff.map(item => item.staff_sn);
    const { selectAll, selected } = this.state;
    // const { data } = selected;
    // if (selectAll) {
    //   selected.data = [];
    //   selected.num = 0;
    // } else {
    //   selected.data = [...staff];
    //   selected.num = staff.length;
    // }
    // selected.total = 50;
    const newSelected = dealCheckAll(selected, staffSn, 'staff_sn', selectAll, staff);
    this.setState({
      selected: newSelected,
      selectAll: !selectAll,
    });
  }

  firstDepartment = () => {
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

  selectOk = () => {
    const { dispatch, match: { params } } = this.props;
    const { modal } = params;
    const { selected, key, type } = this.state;
    const newSelectstaff = selected.data;
    dispatch({
      type: `${modal}/saveStaff`,
      payload: {
        key,
        type,
        value: newSelectstaff,
      },
    });

    // history.goBack(-1);
  }

  render() {
    const {
      department,
      staff, searStaff,
      breadCrumb, loading1,
      loading2, loading3,
      history, location,
    } = this.props;
    const someProps = {
      location,
      history,
    };
    const { selected, type, search, key, selectAll } = this.state;
    const selectedData = selected.data;
    const isFinal = key === 'final';
    const { page, totalpage, data = [] } = searStaff;
    const tempFinal = this.onFinalSearch(search);
    const staffSn = staff.map(item => item.staff_sn);
    const checkAble = selectedData.filter(item =>
      staffSn.indexOf(item.staff_sn) > -1).length === staffSn.length && selectAll;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={`${type}` === '1'}
          name={isFinal ? 'staff_name' : 'realname'}
          isFinal={isFinal}
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.selDepartment}
          fetchDataSource={this.firstDepartment}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
        >
          <div
            style={{ ...(loading1 || loading2 || loading3 ? { display: 'none' } : null) }}
          >
            {department.length && !search ? (
              <Department
                dataSource={department}
                heightNone
                onRefresh={false}

                fetchDataSource={this.selDepartment}
                name="id"
              />
            ) : null}
            {((search && data && !data.length && !tempFinal.length)
              || (!search && !staff.length && !department.length)) ? <Nothing /> : null}
            {!search && !isFinal ? (
              <Staff
                link=""
                heightNone
                isFinal={isFinal}
                onRefresh={false}
                name="staff_sn"
                renderName={isFinal ? 'staff_name' : 'realname'}
                dispatch={this.props.dispatch}
                multiple={`${type}` === '1'}
                selected={selected.data}
                dataSource={staff}
                onChange={this.getSelectResult}
              />
            ) : null}
            {search && !isFinal ? (
              <SeStaff
                {...someProps}
                type={key}
                link=""
                heightNone
                isFinal={isFinal}
                name="staff_sn"
                renderName={isFinal ? 'staff_name' : 'realname'}
                page={page}
                totalpage={totalpage}
                onPageChange={this.onPageChange}
                dispatch={this.props.dispatch}
                multiple={`${type}` === '1'}
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
