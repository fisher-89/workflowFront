// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, SearchBar } from 'antd-mobile';
import filterImg from '../../assets/filter.svg';
import { startState } from '../../utils/convert';
import { findInitIndex, excludeSpecial,
  getUrlParams, getUrlString, doConditionValue, parseParamsToUrl, makerFilters,
} from '../../utils/util';

import styles from '../../routes/common.less';
import style from './index.less';
// import './reset.less';
import ModalFilters from '../../components/ModalFilters';
@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class ListControl extends Component {
  state = {
    type: 'all',
    visible: false,
    model: 'filters',
    searchValue: '',
    // shortModal: false,
  }

  componentWillMount() {
    const { lists, location: { pathname, search }, history } = this.props;
    const urlParams = getUrlParams();
    this.filterUrl = getUrlString('filters', search ? search.slice(1) : '');
    const { type = 'all', page = 1 } = urlParams;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;
    const currentPage = url.page;
    if (`${currentPage}` !== `${page || 1}`) {
      const params = { ...urlParams };
      params.page = 1;
      const paramsUrl = parseParamsToUrl(params);
      const newUrl = paramsUrl ? `?${paramsUrl}` : '';
      history.replace(`${pathname}${newUrl}`);
    }

    this.setState({
      type,
      searchValue: this.fetchSearchValue(),
    }, () => {
      this.currentFilter(search ? search.slice(1) : parseParamsToUrl(url));
      this.fetchDataSource({ ...urlParams, ...url, filters: this.filterUrl });
    });
  }

  componentWillReceiveProps(props) {
    const { location: { search } } = props;
    const currentParams = getUrlParams(search);
    const { type = 'all' } = currentParams;
    this.setState({
      type,
    });
    if (search !== this.props.location.search) {
      this.currentFilter(search ? search.slice(1) : '');
      const params = getUrlParams(search);
      this.filterUrl = getUrlString('filters', search ? search.slice(1) : '');
      this.setState({
        searchValue: this.fetchSearchValue(),
      });
      this.fetchSearchValue();
      this.fetchDataSource({ ...params, filters: this.filterUrl });
    }
  }

  onResetForm = () => {
    // const {type}
    this.handleChangeFilter('');
  }

  findNotBelong = () => {
    const { filterColumns } = this.props;
    const notBelongs = filterColumns.filter(item => item.notbelong);
    return notBelongs;
  }

  fetchSearchValue = () => {
    const { searchColumns } = this.props;
    const filterParams = doConditionValue(this.filterUrl);
    const searchName = searchColumns.name;
    const searchInfo = filterParams[searchName];
    const searchValue = searchInfo ? searchInfo.like : '';
    return searchValue;
  }

  fetchDataSource = (params) => {
    const {
      handleFetchDataSource,
    } = this.props;
    handleFetchDataSource(params);
  }

  statusChange = (tab) => { // tab切换
    const { history, lists, location: { pathname } } = this.props;
    const { type } = tab;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;
    let newUrl = parseParamsToUrl(url);
    newUrl = newUrl ? `?${newUrl}` : '';
    history.replace(`${pathname}${newUrl}`);
  }

  currentFilter = (url) => {
    const notbelongs = this.findNotBelong();
    const filterUrl = getUrlString('filters', url);
    const notbelongParams = [];
    notbelongs.forEach((item) => {
      const str = getUrlString(item.name, url);
      if (str) {
        notbelongParams.push(`${item.name}=${str}`);
      }
    });
    const filterParams = `${notbelongParams.join(';')};${filterUrl}`;
    this.filters = doConditionValue(filterParams);
  }

  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  fetchFiltersDataSource = (params) => {
    const { type } = this.state;
    const { lists, location: { pathname }, history } = this.props;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;
    const lastParams = url;
    const newParams = { ...lastParams, ...params, page: 1 };
    const paramsUrl = parseParamsToUrl(newParams);
    const newParamsUrl = paramsUrl ? `?${paramsUrl}` : '';
    this.handleChangeFilter(newParams);
    history.replace(`${pathname}${newParamsUrl}`);
  }

  handleChangeFilter = (params) => {
    const { dispatch, location: { pathname } } = this.props;
    const { type } = this.state;
    dispatch({
      type: 'list/saveFilterTerm',
      payload: {
        key: `${pathname}_${type}`,
        value: params,
      },
    });
  }

  searchOnchange = (key, v) => {
    const value = excludeSpecial(v);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.setState({
        searchValue: value,
      }, () => {
        const { history, location: { pathname, search } } = this.props;
        const params = getUrlParams(search);
        const filterUrl = getUrlString('filters', search);
        const filterParams = doConditionValue(filterUrl);
        const newFilterParams = {
          ...filterParams,
          [key]: {
            like: value,
          },
        };
        const newParams = {
          ...params,
          page: 1,
          filters: newFilterParams,
        };
        const parseNewParams = makerFilters(newParams);
        const newParamsUrl = parseParamsToUrl(parseNewParams);
        this.handleChangeFilter(parseNewParams);
        const newSearch = newParamsUrl ? `?${newParamsUrl}` : '';
        history.replace(`${pathname}${newSearch}`);
      }, 1000);
    });
  }

  render() {
    const { children, tab, filterColumns, searchColumns } = this.props;
    const { type, searchValue } = this.state;
    const initIndex = findInitIndex(startState, 'type', type);
    const searchName = searchColumns.name;
    return (
      <div className={styles.con}>
        <div>
          <SearchBar
            placeholder="Search"
            value={searchValue}
            onChange={value => this.searchOnchange(searchName, value)}
          />
        </div>
        <Tabs
          tabs={tab}
          renderTabBar={props => (
            <Tabs.DefaultTabBar
              {...props}
              page={4}
            />
            )}
          onChange={this.statusChange}
          initialPage={initIndex}
        >
          {children}
        </Tabs>
        <div className={style.img} style={{ top: '1.46666667rem' }}>
          <i />
          <img
            src={filterImg}
            style={{ width: '0.533rem', height: '0.533rem' }}
            alt=""
            onClick={() => this.handleVisible(true, 'filter')}
          />
        </div>
        <ModalFilters
          visible={this.state.visible}
          model={this.state.model}
          filters={this.filters}
            // sorter={this.sorter}
          onResetForm={this.onResetForm}
          filterColumns={filterColumns}
            // sorterData={sortList}
          fetchDataSource={this.fetchFiltersDataSource}
          onCancel={this.handleVisible}
        />
      </div>
    );
  }
}

ListControl.defaultProps = {
  searchColumns: {
    name: 'name',
    defaultValue: '',
  },
  handleFetchDataSource: () => { },
};
