import React, { Component } from 'react';
import { connect } from 'dva';
import { DepContainer, Nothing } from '../../components/index';
import { SelDep } from '../../common/ListView/index.js';
import { markTreeData, getOriginTree, makeFieldValue, makeBreadCrumbData, getUrlParams } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ formSearchDep, loading }) => ({
  isConfig: formSearchDep.isConfig,
  department: formSearchDep.department,
  breadCrumb: formSearchDep.breadCrumb,
  currentKey: formSearchDep.currentKey,
  loading: loading.global,
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
    const { department, isConfig } = nextProps;
    const oldDep = this.props.department;
    const { init } = this.state;
    if (JSON.stringify(department) !== JSON.stringify(oldDep) || !init) {
      const tree = markTreeData(department, 0, { parentId: 'parent_id', key: 'id' });
      this.setState({
        currentDep: isConfig ? department : tree,
        init: true,
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
    const { department } = this.props;
    const result = department.filter((item) => {
      const { name } = item;
      return name.indexOf(search) > -1;
    });
    this.setState({
      currentDep: result,
      search,
    });
  }

  getSelectResult = (result, current) => {
    const { selected, multiple, switchState } = this.state;
    const oldData = selected.data;
    if (multiple) {
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
    } else {
      this.getSingleSelect(result);
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
    const { params: { key } } = this.state;
    const { history, currentKey } = this.props;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const newSelectstaff = result;
    if (cb) {
      cb(newSelectstaff);
    }
    history.goBack(-1);
  }

  getInitState = () => {
    const { currentKey } = this.props;
    const urlParams = getUrlParams();
    const paramsValue = urlParams.params;
    const params = JSON.parse(paramsValue);
    const { key, type, max, min } = params;
    const current = currentKey[key] || {};
    const multiple = type;
    const data = current.data || (multiple ? [] : {});
    let newData = [];
    if (!multiple && !Object.keys(data || {}).length) {
      newData = {};
    } else {
      newData = makeFieldValue(data, { value: 'id', text: 'name' }, multiple);
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
        min: min || 1,
        num: mutiData.length,
      },
      singleSelected,
      // selectAll: false,
      search: '',
      switchState: false,
      // key, // 选的什么人
      // type, // 选的类型，单选还是多选
      currentDep: [],
      multiple,
      params,
    };
    return obj;
  }

  makeBreadCrumb = (params) => {
    const { breadCrumb } = this.props;
    return makeBreadCrumbData(params, breadCrumb, 'id');
  }

  selDepartment = (data) => {
    const { params: { id } } = this.state;
    const newBread = this.makeBreadCrumb(data);
    const parentId = data.id;
    let payload = null;
    if (`${parentId}` !== '-1') {
      payload = {
        breadCrumb: newBread,
        reqData: { field_id: id, department: parentId },
      };
    }
    this.fetchDataSource(payload);
  }

  fetchDataSource = (payload) => {
    const { dispatch } = this.props;
    const { params: { id } } = this.state;
    let newParams = {};
    if (payload) {
      newParams = { ...payload };
    } else {
      newParams = {
        breadCrumb: [{ name: '选择部门', id: '-1' }],
        reqData: { field_id: id },
      };
    }
    dispatch({
      type: 'formSearchDep/fetchFirstDepartment',
      payload: { ...newParams },
    });
  }

  checkedAll = (selectAll, name = 'id') => { // 全选
    // const { department } = this.props;
    // const { params: { max } } = this.state;
    const { selected, switchState, currentDep } = this.state;
    let depSn = currentDep.map(item => `${item.id}`);

    // const curDepSn = currentDep.map(item => `${item.id}`);
    const { data } = selected;
    // const selectAll = data.filter(item =>
    //   curDepSn.indexOf(`${item.id}`) > -1).length !== curDepSn.length;
    let newData = [];
    let selfAndChild = [...currentDep];
    if (switchState) { // 开启包含下级
      selfAndChild = this.getChildrenArray(currentDep);
      depSn = selfAndChild.map(item => `${item[name]}`);
    }

    if (selectAll) {
      newData = [...data, ...selfAndChild];
    } else {
      newData = data.filter(item => depSn.indexOf(`${item[name]}`) === -1);
    }
    const result = newData.unique('id');
    selected.data = result;
    selected.num = result.length;
    // selected.total = max || 50;
    // selected.total = min || 50;
    this.setState({
      selected,
      // selectAll: !selectAll,
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
    });
    const { breadCrumb } = this.props;
    const item = breadCrumb[breadCrumb.length - 1];
    this.fetchNextDep(item);
  }

  selectOk = () => {
    const { history, currentKey } = this.props;
    const { params: { key } } = this.state;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const { selected } = this.state;
    const newSelect = selected.data;

    if (cb) {
      cb(newSelect);
    }
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
    let breadCrumb = [{ name: '一级部门', id: -1 }];
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
      breadCrumb,
      isConfig, loading,
    } = this.props;

    const { selected, multiple, search, currentDep,
      switchState, singleSelected } = this.state;
    const selectedData = selected.data;
    const depSn = currentDep.map(item => item.id);
    const checkAble = selectedData.filter(item =>
      depSn.indexOf(item.id) > -1).length === currentDep.length;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <DepContainer
          isIncludeNext={!isConfig}
          multiple={multiple}
          singleSelected={singleSelected}
          name="name"
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          switchState={switchState}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.fetchNextDep}
          fetchDataSource={() => this.fetchDataSource()}
          selectOk={this.selectOk}
          onSwitchChange={(check) => { this.setState({ switchState: check }); }}
          searchOncancel={this.searchOncancel}
          handleDelete={this.getSelectResult}
        >

          {!currentDep.length && !loading && (
          <Nothing />
          )}
          <SelDep
            link=""
            onRefresh={false}
            name="id"
            heightNone
            renderName="name"
            singleSelected={singleSelected}
            multiple={multiple}
            selected={selected.data}
            dataSource={currentDep}
            extra={!search && !isConfig && this.renderExtraContent}
            onChange={this.getSelectResult}
          />

        </DepContainer>
      </div>
    );
  }
}
