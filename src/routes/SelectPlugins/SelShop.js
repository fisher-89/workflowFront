import React, { Component } from 'react';
import { connect } from 'dva';
import { PersonContainer } from '../../components/index';
import { Shop } from '../../common/ListView/index.js';
import { makeFieldValue, getUrlParams } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ formSearchShop, loading }) => ({
  formSearchShop,
  shop: formSearchShop.shop,
  breadCrumb: formSearchShop.breadCrumb,
  loading: loading.effects['formSearchShop/fetchFirstDepartment'],
  searchLoding: loading.effects['formSearchShop/serachStaff'],
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
    const { params: { id } } = this.state;
    this.fetchDataSource({
      page: 1, pagesize: 15, field_id: id,
    });
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
    const { params: { id } } = this.state;
    const currentParams = {
      field_id: id,
      page: 1,
      pagesize: 15,
      filters: {
        name: { like: search },
      },
    };

    this.setState({
      search,
    }, () => {
      this.fetchDataSource(currentParams);
    });
  }

  onPageChange = () => {
    const { shop } = this.props;
    const { search, params: { id } } = this.state;
    const { page } = shop;
    const currentParams = {
      field_id: id,
      page: page + 1,
      pagesize: 15,
      filters: {
        name: { like: search },
      },
    };
    this.fetchDataSource(currentParams);
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
      // const newResult = result.map((item) => {
      //   const obj = { ...item };
      //   obj.staff_name = item.realname || item.staff_name;
      //   return obj;
      // });
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
    const { key } = this.state;
    const { history, formSearchShop: { currentKey } } = this.props;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const newSelectstaff = result;
    if (cb) {
      cb(newSelectstaff);
    }
    history.goBack(-1);
  }

  getInitState = () => {
    const { formSearchShop: { currentKey } } = this.props;
    const urlParams = getUrlParams();
    const paramsValue = urlParams.params;
    const params = JSON.parse(paramsValue);
    const { key, type, max } = params;

    const current = currentKey[`${key}`] || {};
    const multiple = `${type}` === '1';
    const data = current.data || (multiple ? [] : {});
    const newData = makeFieldValue(data, { value: 'shop_sn', text: 'name' }, multiple);
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
      },
      selectAll: false,
      search: '',
      params,
      singleSelected,
      key, // 选的什么人
      type, // 选的类型，单选还是多选
    };
    return obj;
  }

  fetchDataSource = (payload) => {
    const { dispatch } = this.props;
    const { params: { id } } = this.state;
    let newParams = {};
    if (payload) {
      newParams = { ...payload };
    } else {
      newParams = { field_id: id, page: 1, pagesize: 15 };
    }
    dispatch({
      type: 'formSearchShop/getShopList',
      payload: { ...newParams },
    });
  }

  checkedAll = () => { // 全选
    const name = 'shop_sn';
    const { shop } = this.props;
    const shopData = shop.data || [];
    const shopSn = shopData.map(item => item[name]);
    const { selectAll, selected, params: { max } } = this.state;
    const { data } = selected;
    if (selectAll) {
      const newData = data.filter(item => shopSn.indexOf(item[name]) === -1);
      selected.data = newData;
      selected.num = newData.length;
    } else {
      const newData = [...data, ...shopData];
      const result = [];
      const obj = {};
      for (let i = 0; i < newData.length; i += 1) {
        if (!obj[newData[i][name]]) { // 如果能查找到，证明数组元素重复了
          obj[newData[i][name]] = 1;
          result.push(newData[i]);
        }
      }
      selected.data = result;
      selected.num = result.length;
    }
    selected.total = max || 50;

    this.setState({
      selected,
      selectAll: !selectAll,
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
    });
    this.fetchDataSource();
  }

  makeFormShop = (newSelectsShop) => {
    const selectedShop = newSelectsShop.map((item) => {
      const obj = {};
      obj.key = item.shop_sn;
      obj.value = item.name;
      return obj;
    });
    return selectedShop;
  }

  selectOk = () => {
    const { history, formSearchStaff: { currentKey }, dispatch } = this.props;
    const { params } = this.state;
    const { key } = params;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const { selected } = this.state;
    const newSelectShop = selected.data;
    const formSeleted = this.makeFormShop(newSelectShop);
    if (cb) {
      cb(formSeleted);
    }
    dispatch({
      type: 'formSearchShop/saveSelectShop',
      payload: {
        key,
        value: formSeleted,
      },
    });
    history.goBack(-1);
  }

  render() {
    const {
      shop,
      breadCrumb,
      loading,
      history, location,
    } = this.props;
    const someProps = {
      location,
      history,
    };
    const { page, totalpage, data } = shop;
    const { selected, type, key, selectAll, singleSelected } = this.state;
    const selectedData = selected.data;
    const shopSn = (data || []).map(item => item.shop_sn);
    const checkAble = selectedData.filter(item =>
      shopSn.indexOf(item.shop_sn) > -1).length === shopSn.length && selectAll;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={`${type}` === '1'}
          name="shop_sn"
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          all={false}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
        >
          <div
            style={{ ...(loading ? { display: 'none' } : null) }}
          >
            <Shop
              {...someProps}
              type={key}
              link=""
              name="shop_sn"
              renderName="name"
              page={page}
              totalpage={totalpage}
              singleSelected={singleSelected}
              onPageChange={this.onPageChange}
              dispatch={this.props.dispatch}
              multiple={type === '1'}
              selected={selected.data}
              dataSource={data}
              onRefresh={this.onRefresh}
              onChange={this.getSelectResult}
            />

          </div>
        </PersonContainer>
      </div>
    );
  }
}
