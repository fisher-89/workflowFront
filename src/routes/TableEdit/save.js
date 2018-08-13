// 发起列表

import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, SearchBar } from 'antd-mobile';
import filterImg from '../../assets/filter.svg';
import { startState } from '../../utils/convert';
import {
  userStorage, dealFlowTypeOptions, findInitIndex,
  getUrlParams, getUrlString, doConditionValue, parseParamsToUrl, makerFilters,
} from '../../utils/util';

import styles from '../common.less';
import style from './index.less';
import './reset.less';
import { Start } from '../../common/ListView';
import ModalFilters from '../../components/ModalFilters';

const flowList = userStorage('flowList');
const flowTypeOptions = dealFlowTypeOptions(flowList);
const tabs = {
  processing: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        multiple: true,
        title: '审核环节',
        options: flowTypeOptions,
      },
    ],
  },
  finished: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
  rejected: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
  withdraw: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
  all: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
        multiple: true,
        options: flowTypeOptions,
      },
    ],
  },
};
const searchColumns = {
  name: 'name',
  defaultValue: '',
};
@connect(({ loading, list, common }) => ({
  loading,
  common,
  lists: list.lists,
}))
export default class StartList extends Component {
  state = {
    page: 1,
    totalpage: 10,
    type: 'all',
    visible: false,
    model: 'filters',
    searchValue: '',
    // shortModal: false,
  }

  componentWillMount() {
    const { lists, location: { pathname, search } } = this.props;
    const urlParams = getUrlParams();
    this.filterUrl = getUrlString('filters', search ? search.slice(1) : '');
    const { type = 'all' } = urlParams;
    const current = lists[`${pathname}_${type}`];
    const { url } = current;

    this.setState({
      type,
      searchValue: this.fetchSearchValue(),
    }, () => {
      this.currentFilter(search ? search.slice(1) : parseParamsToUrl(url));
      this.fetchDataSource({ ...urlParams, filters: this.filterUrl });
    });
  }

  componentWillReceiveProps(props) {
    const { location: { search, pathname }, lists } = props;
    const currentParams = getUrlParams(search);
    const { type = 'all' } = currentParams;
    const lastList = lists[`${pathname}_${type}`];
    const lastDatas = lastList.datas;
    const { page, totalpage } = lastDatas;
    this.setState({
      page, totalpage, type,
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
    const { type } = this.state;
    const { filterColumns } = tabs[type];
    const notBelongs = filterColumns.filter(item => item.notbelong);
    return notBelongs;
  }

  fetchSearchValue = () => {
    const filterParams = doConditionValue(this.filterUrl);
    const searchName = searchColumns.name;
    const searchInfo = filterParams[searchName];
    const searchValue = searchInfo ? searchInfo.like : '';
    return searchValue;
  }
  fetchDataSource = (params) => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    dispatch({
      type: 'list/getStartList',
      payload: {
        parms: {
          ...params,
        },
        path: pathname,
      },
    });
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
    this.setState({
      page: 1,
    }, () => {
      const newParams = { ...lastParams, ...params, page: 1 };
      const paramsUrl = parseParamsToUrl(newParams);
      const newParamsUrl = paramsUrl ? `?${paramsUrl}` : '';
      this.handleChangeFilter(newParams);
      history.replace(`${pathname}${newParamsUrl}`);
    });
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

  renderContent = () => {
    const { lists, location: { pathname } } = this.props;
    const { type, page, totalpage } = this.state;
    const currentDatas = lists[`${pathname}_${type}`].datas;
    const { data } = currentDatas;
    return (
      <Start dataSource={data} page={page} totalpage={totalpage} />
    );
  }

  render() {
    const { type, searchValue } = this.state;
    const { filterColumns } = tabs[type];
    const initIndex = findInitIndex(startState, 'type', type);
    const searchName = searchColumns.name;
    return (
      <div className={styles.con}>
        <div className={style.con_list}>
          <SearchBar
            placeholder="Search"
            value={searchValue}
            onChange={value => this.searchOnchange(searchName, value)}
          />
          <Tabs
            tabs={startState}
            renderTabBar={props => (
              <Tabs.DefaultTabBar
                {...props}
                page={4}
              />
            )}
            onChange={this.statusChange}
            initialPage={initIndex}
          >
            {this.renderContent(type)}
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
      </div>
    );
  }
}

