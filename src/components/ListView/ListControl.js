// 发起列表

import React, { Component } from 'react';
import { debounce } from 'lodash';
import { connect } from 'dva';
import { Tabs, SearchBar } from 'antd-mobile';
import {
  findInitIndex, excludeSpecial,
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
  constructor(props) {
    super(props);
    const { defaultType } = props;
    this.state = {
      type: defaultType,
      visible: false,
      model: 'filters',
      searchValue: '',
    };
    this.fetchFiltersDataSource = debounce((params) => {
      this.dealDebounce(params);
    }, 500);
  }

  componentWillMount() {
    const { lists, location: { pathname, search }, history, defaultType, defaultSort } = this.props;
    const urlParams = getUrlParams();
    this.filterUrl = getUrlString('filters', search ? search.slice(1) : '');
    const { type = defaultType, page = 1 } = urlParams;
    const newParams = {
      ...urlParams,
      sort: urlParams.sort || defaultSort,
      filters: this.filterUrl || '',
    };
    const current = lists[`${pathname}_${type}`];
    const { url, datas } = current;
    const { data } = datas;

    this.setState({
      type,
      searchValue: this.fetchSearchValue(),
    }, () => {
      this.sorter = newParams.sort;
      this.handleChangeFilter(newParams);
      this.currentFilter(search ? search.slice(1) : parseParamsToUrl(url));
      if (!data || (data && data.length)) { // 有数据，不调接口
        return;
      }
      // 没有数据：初次进入页面或刷新了
      const currentPage = url.page;
      if (`${currentPage}` !== `${page || 1}`) { // 刷新了
        const params = { ...newParams };
        params.page = 1;
        const paramsUrl = parseParamsToUrl(params);
        const newUrl = paramsUrl ? `?${paramsUrl}` : '';
        history.replace(`${pathname}${newUrl}`);
      } else {
        this.fetchDataSource({ ...newParams, ...url, page: 1 });
      }
    });
  }

  componentWillReceiveProps(props) {
    const { location: { search, pathname, hash }, lists, defaultType, defaultSort } = props;
    const currentParams = getUrlParams(search);
    const { type = defaultType } = currentParams;
    // this.setState({
    //   type,
    // });
    if (search !== this.props.location.search) {
      this.currentFilter(search ? search.slice(1) : '');
      const params = getUrlParams(search);
      this.filterUrl = getUrlString('filters', search ? search.slice(1) : '');
      this.setState({
        searchValue: this.fetchSearchValue(),
        type,
      });
      const newParams = {
        ...params,
        sort: params.sort || defaultSort,
        filters: this.filterUrl || '',
      };
      this.sorter = newParams.sort;
      this.handleChangeFilter(newParams);
      this.fetchSearchValue();
      const current = lists[`${pathname}_${type}`];
      const { url } = current;
      if (
        (JSON.stringify(url) === JSON.stringify(newParams) && !hash)) { // 有数据，不调接口
      }
      this.fetchDataSource(newParams);
    }
  }

  onResetForm = () => {
    const { location: { search, pathname }, history, defaultType } = this.props;
    const currentParams = getUrlParams(search);
    const { type = defaultType } = currentParams;
    const url = `${pathname}?type=${type}&page=1`;
    history.replace(url);
  }

  findNotBelong = () => {
    const { filterColumns = [] } = this.props;
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

  dealDebounce = (params) => {
    const { type } = this.state;
    const { lists, location: { pathname }, history } = this.props;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;
    const lastParams = url;
    const newParams = { ...lastParams, ...params, page: 1 };
    const paramsUrl = parseParamsToUrl(newParams);
    const newParamsUrl = paramsUrl ? `?${paramsUrl}` : '';
    history.replace(`${pathname}${newParamsUrl}`);
  }

  handleChangeFilter = (params) => {
    const { defaultType } = this.props;
    const { type = defaultType } = params;
    const { dispatch, location: { pathname } } = this.props;
    dispatch({
      type: 'list/saveFilterTerm',
      payload: {
        key: `${pathname}_${type}`,
        value: params,
      },
    });
  }

  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  searchOnchange = (key, v) => {
    const value = excludeSpecial(v);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({
      searchValue: value,
    }, () => {
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
          // this.handleChangeFilter(parseNewParams);
          const newSearch = newParamsUrl ? `?${newParamsUrl}` : '';
          history.replace(`${pathname}${newSearch}`);
        });
      }, 500);
    });
  }

  switchCurSort = () => {
    const { location: { search, pathname }, defaultSort, history } = this.props;
    const urlParams = getUrlParams();
    const sortUrl = getUrlString('sort', search ? search.slice(1) : '') || defaultSort;
    const index = sortUrl.lastIndexOf('-');
    const sort = sortUrl.slice(index + 1);
    const sortname = sortUrl.slice(0, index);
    const newSort = `${sortname}-${sort === 'desc' ? 'asc' : 'desc'}`;
    const newParams = {
      ...urlParams,
      sort: newSort,
      filters: this.filterUrl || '',
      page: 1,
    };
    const paramsUrl = parseParamsToUrl(newParams);
    history.replace(`${pathname}?${paramsUrl}`);
  }

  renderFilter = () => {
    const { filterColumns, children, sortList = [] } = this.props;
    const activeStyle = Object.keys(this.filters || {}).length ? style.active : null;
    let [sortItem] = sortList.filter(item => item.value === this.sorter);
    if (!sortItem) {
      [sortItem] = sortList;
    }
    return (
      <React.Fragment>
        {filterColumns && (
          <div className={style.filter_con}>
            <div
              className={[style.dosort].join(' ')}
              onClick={() => this.handleVisible(true, 'sort')}
            >
              {sortItem.name}
              <span
                style={{
                backgroundImage: `url(${sortItem.icon})`,
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0.4rem',
              }}
                onClick={(e) => {
                  e.stopPropagation();
                  this.switchCurSort();
                }}
              />
            </div>
            <div
              className={[style.filter, activeStyle].join(' ')}
              onClick={() => this.handleVisible(true, 'filter')}
            >筛选
              <span />
            </div>
          </div>
        )}
        {children}
      </React.Fragment>
    );
  }

  render() {
    const { tab, filterColumns, searchColumns, defaultSort, sortList = [], top = '3.813333rem' } = this.props;
    const { type, searchValue } = this.state;
    const initIndex = findInitIndex(tab, 'type', type);
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
        {(tab && tab.length) ? (
          <Tabs
            tabs={tab}
            swipeable={false}
            renderTabBar={props => (
              <Tabs.DefaultTabBar
                {...props}
                page={4}
              />
            )}
            onChange={this.statusChange}
            initialPage={initIndex}
          >
            {this.renderFilter()}
          </Tabs>
        ) :
          this.renderFilter()}
        <ModalFilters
          visible={this.state.visible}
          model={this.state.model}
          filters={this.filters}
          top={top}
          sorter={this.sorter || defaultSort}
          onResetForm={this.onResetForm}
          filterColumns={filterColumns || []}
          sorterData={sortList}
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
  tab: [],
  handleFetchDataSource: () => { },
};
