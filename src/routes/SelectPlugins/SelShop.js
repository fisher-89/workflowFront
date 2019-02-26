import React, { Component } from 'react';
import { connect } from 'dva';
import { PersonContainer } from '../../components/index';
import { Shop } from '../../common/ListView/index.js';
import { makeFieldValue, getUrlParams, dealCheckAll, setNavTitle } from '../../utils/util';
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
    setNavTitle('选择店铺');
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onSearch = (search = '') => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      search, page: 1,
    });
    this.timer = setInterval(() => {
      this.onSearchSubmit(search.trim());
    }, 500);
  }

  onSearchSubmit = (search) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { params: { id }, page } = this.state;
    const currentParams = {
      field_id: id,
      page,
      pagesize: 15,
      filters: {
        name: { like: search },
      },
    };
    this.fetchDataSource(currentParams);
  }

  onPageChange = () => {
    const { search, params: { id }, page } = this.state;
    this.setState({ page: page + 1 });
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
    this.setState({
      page: 1,
      search: '',
    }, () => {
      this.onSearchSubmit();
    });
  }

  getSelectResult = (result) => {
    const { selected, multiple } = this.state;
    if (multiple) {
      this.setState({
        selected: {
          ...selected,
          data: result,
          num: result.length,
        },
      });
    } else {
      this.getSingleSelect(result);
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
    const { key, type, max, min } = params;
    const current = currentKey[`${key}`] || {};
    const multiple = `${type}` === '1';
    const data = current.data || (multiple ? [] : {});
    let newData = [];
    if (!multiple && !Object.keys(data || {}).length) {
      newData = {};
    } else {
      newData = makeFieldValue(data, { value: 'shop_sn', text: 'name' }, multiple);
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
      search: '',
      params,
      page: 1,
      singleSelected,
      key, // 选的什么人
      multiple,
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

  checkedAll = (selectAll) => { // 全选
    const name = 'shop_sn';
    const { shop } = this.props;
    const shopData = shop.data || [];
    const shopSn = shopData.map(item => item[name]);
    const { selected, params: { max } } = this.state;
    const newSelected = dealCheckAll(selected, shopSn, 'shop_sn', selectAll, shop.data, max);
    this.setState({
      selected: newSelected,
    });
  }

  searchOncancel = () => {
    this.setState({
      search: '',
      page: 1,
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
    const { history, formSearchShop: { currentKey }, dispatch } = this.props;
    const { params } = this.state;
    const { key } = params;
    const current = { ...currentKey[`${key}`] || {} };
    const { cb } = current;
    const { selected } = this.state;
    const newSelectShop = selected.data;
    // const formSeleted = this.makeFormShop(newSelectShop);
    if (cb) {
      cb(newSelectShop);
    }
    dispatch({
      type: 'formSearchShop/saveSelectShop',
      payload: {
        key,
        value: newSelectShop,
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
    const { totalpage, data } = shop;
    const { selected, singleSelected, page, multiple, search } = this.state;
    const selectedData = selected.data;
    const shopSn = (data || []).map(item => `${item.shop_sn}`);
    const checkAble = !!(selectedData.filter(item =>
      shopSn.indexOf(`${item.shop_sn}`) > -1).length === shopSn.length && shopSn.length);
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={multiple}
          name="name"
          search={search}
          singleSelected={singleSelected}
          bread={breadCrumb}
          checkAble={checkAble}
          selected={selected}
          all={false}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
          handleDelete={this.getSelectResult}
        >
          <div
            style={{ ...(loading ? { display: 'none' } : null) }}
          >
            <Shop
              {...someProps}
              link=""
              name="shop_sn"
              renderName="name"
              page={page}
              totalpage={totalpage}
              singleSelected={singleSelected}
              onPageChange={this.onPageChange}
              dispatch={this.props.dispatch}
              multiple={multiple}
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
