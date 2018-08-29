import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { DepContainer, Nothing } from '../../components/index';
import { SelDep, SeStaff } from '../../common/ListView/index.js';
import { markTreeData, getOriginTree } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ formSearchDep, loading }) => ({
  formSearchDep,
  department: formSearchDep.department,
  finalStaff: formSearchDep.finalStaff,
  searStaff: formSearchDep.searStaff,
  breadCrumb: formSearchDep.breadCrumb,
  loading3: loading.effects['formSearchDep/fetchFirstDepartment'],
  searchLoding: loading.effects['formSearchDep/serachStaff'],
}))
export default class SelDepartment extends Component {
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

  componentWillReceiveProps(nextProps) {
    const { department } = nextProps;
    const oldDep = this.props.department;
    if (JSON.stringify(department) !== JSON.stringify(oldDep)) {
      const tree = markTreeData(department, 0, { parentId: 'parent_id', key: 'id' });
      this.setState({
        currentDep: tree,
      });
    }
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

  getSelectResult = (result, current) => {
    const { selected, type, switchState } = this.state;
    const oldData = selected.data;
    if (type !== '1') {
      this.getSingleSelect(result);
    } else {
      let newSeleted = result;
      const oldSn = oldData.map(item => item.id);
      const isRemove = oldSn.indexOf(current.id) > -1;
      if (switchState) {
        const currentChild = getOriginTree(current);
        const curChildSn = currentChild.map(item => item.id);
        if (isRemove) {
          newSeleted = result.filter(item => curChildSn.indexOf(item.id) === -1);
        } else {
          newSeleted = [...result, ...currentChild];
        }
      }
      const data = newSeleted.unique('id');
      this.setState({
        selected: {
          ...selected,
          data,
          num: data.length,
        },
      });
    }
  }

  getChildrenArray = (result) => {
    const { currentDep } = this.state;
    const depId = result.map(item => item.id);
    const currentChecked = currentDep.filter(item => depId.indexOf(item.id) !== -1);
    let selfAndChild = [];
    currentChecked.forEach((item) => {
      const origin = getOriginTree(item);
      selfAndChild = selfAndChild.concat(origin);
    });
    return selfAndChild;
  }

  getSingleSelect = (result) => {
    const { key } = this.state;
    const { history, formSearchDep: { currentKey }, dispatch } = this.props;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const newSelectstaff = [result];
    if (cb) {
      cb(newSelectstaff);
    }
    dispatch({
      type: 'formSearchDep/saveSelectStaff',
      payload: {
        key,
        value: newSelectstaff,
      },
    });
    history.goBack(-1);
  }

  getInitState = () => {
    const { match: { params }, formSearchDep: { currentKey } } = this.props;
    const { key, type } = params;
    const current = currentKey[`${key}`] || {};
    const { data = [] } = current;
    const obj = {
      selected: {
        data,
        total: 50,
        num: data.length,
      },
      selectAll: false,
      search: '',
      switchState: false,
      key, // 选的什么人
      type, // 选的类型，单选还是多选
      currentDep: [],
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
        breadCrumb: [{ name: '选择部门', id: '-1' }],
        reqData: { field_id: fieldId },
      };
    }
    dispatch({
      type: 'formSearchDep/fetchFirstDepartment',
      payload: { ...newParams },
    });
  }

  fetchPageDataSource = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'formSearchDep/serachStaff',
      payload: params,
    });
  }

  checkedAll = (name = 'id') => { // 全选
    const { department } = this.props;
    let depSn = department.map(item => item.id);
    const { selected, switchState, currentDep } = this.state;
    const curDepSn = currentDep.map(item => item.id);
    const { data } = selected;
    const selectAll = data.filter(item =>
      curDepSn.indexOf(item.id) > -1).length !== curDepSn.length;
    let newData = [];
    let selfAndChild = [...currentDep];
    if (switchState) { // 开启包含下级
      selfAndChild = this.getChildrenArray(currentDep);
      depSn = selfAndChild.map(item => item[name]);
    }
    if (selectAll) {
      newData = [...data, ...selfAndChild];
    } else {
      newData = data.filter(item => depSn.indexOf(item[name]) === -1);
    }
    const result = newData.unique('id');
    selected.data = result;
    selected.num = result.length;
    selected.total = 50;
    this.setState({
      selected,
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

  selectOk = () => {
    const { match: { params }, history, formSearchDep: { currentKey }, dispatch } = this.props;
    const { key } = params;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const { selected } = this.state;
    const newSelectstaff = selected.data;
    if (cb) {
      cb(newSelectstaff);
    }
    dispatch({
      type: 'formSearchDep/saveSelectStaff',
      payload: {
        key,
        value: newSelectstaff,
      },
    });
    history.goBack(-1);
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

  fetchNextDep = (item) => {
    const { department, dispatch } = this.props;
    let currentChild = [];
    let breadCrumb = [{ name: '选择部门', id: -1 }];
    if (`${item.id}` === '-1') {
      currentChild = markTreeData(department, 0, { parentId: 'parent_id', key: 'id' });
    } else {
      currentChild = item.children || [];
      breadCrumb = this.makeBreadCrumbData(item);
    }
    this.setState({
      currentDep: currentChild,
    });
    dispatch({
      type: 'formSearchDep/save',
      payload: {
        store: 'breadCrumb',
        data: breadCrumb,
      },
    });
  }

  renderExtraContent = (value) => {
    const extra = (
      <div className={style.extra} onClick={() => this.fetchNextDep(value)} />
    );
    return extra;
  }

  render() {
    const {
      searStaff,
      breadCrumb,
      loading3,
      history, location,
    } = this.props;
    const someProps = {
      location,
      history,
    };
    const { selected, type, search, key, currentDep, switchState } = this.state;
    const selectedData = selected.data;
    const { page, totalpage, data = [] } = searStaff;
    const depSn = currentDep.map(item => item.id);
    const checkAble = selectedData.filter(item =>
      depSn.indexOf(item.id) > -1).length === currentDep.length;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <DepContainer
          multiple={type === '1'}
          name="name"
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          switchState={switchState}
          checkedAll={() => this.checkedAll('id')}
          handleSearch={this.onSearch}
          handleBread={this.fetchNextDep}
          fetchDataSource={() => this.fetchDataSource()}
          selectOk={this.selectOk}
          onSwitchChange={(check) => { this.setState({ switchState: check }); }}
          searchOncancel={this.searchOncancel}
        >
          <div
            // className={style.child}
            style={{ ...(loading3 ? { display: 'none' } : null) }}
          >
            {!currentDep.length && <Nothing />}
            {!search ? (
              <SelDep
                link=""
                heightNone
                hasExtra={false}
                onRefresh={false}
                name="id"
                renderName="name"
                dispatch={this.props.dispatch}
                multiple={type === '1'}
                selected={selected.data}
                dataSource={currentDep}
                extra={this.renderExtraContent}
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

        </DepContainer>
      </div>
    );
  }
}
