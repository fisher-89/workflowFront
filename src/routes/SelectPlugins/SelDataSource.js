
// 接口类型选择
import React, { Component } from 'react';
import { connect } from 'dva';
import { PersonContainer } from '../../components/index';
import { ApiItem } from '../../common/ListView/index.js';
import { getUrlParams, dealCheckAll, setNavTitle } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';

@connect(({ formSearchApi, loading, api }) => ({
  // apiSource: formSearchApi.apiSource,
  sourceDetails: api.sourceDetails,
  currentKey: formSearchApi.currentKey,
  loading: loading.global,
}))
export default class SelDataSource extends Component {
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
    const { apiSource } = this.state;
    const result = apiSource.filter((item) => {
      const { text } = item;
      return text.indexOf(search) > -1;
    });
    this.setState({
      curDataSource: result,
      search,
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
    const { currentKey, sourceDetails } = this.props;
    const urlParams = getUrlParams();
    const paramsValue = urlParams.params;
    const params = JSON.parse(paramsValue);
    const { key, type, max, min, fetchId, title } = params;
    setNavTitle(title);
    const current = currentKey[key] || {};
    const multiple = !!type;
    const data = current.data || (multiple ? [] : {});
    let editValue;
    const dataSource = sourceDetails[fetchId] || [];
    if (multiple) {
      editValue = data.map((item) => {
        const [curItem = {}] = dataSource.filter(its => `${its.value}` === `${item}`);
        const obj = {};
        obj.value = item;
        obj.text = curItem.text;
        return obj;
      });
    } else {
      editValue = { value: data, text: data };
    }
    const newData = editValue;
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
      // key, // 选的什么人
      // type, // 选的类型，单选还是多选
      apiSource: dataSource,
      curDataSource: dataSource,
      multiple,
      params,
    };
    return obj;
  }

  fetchDataSource = () => {
    const { params: { fetchId } } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'api/fetchApi',
      payload: {
        cb: (data) => {
          this.setState({
            curDataSource: data,
          });
        },
        id: fetchId,
      },
    });
  }

  checkedAll = () => { // 全选
    const { apiSource } = this.state;
    const staffSn = apiSource.map(item => item.value);
    const { selectAll, selected, params: { max } } = this.state;
    const newSelected = dealCheckAll(selected, staffSn, 'value', selectAll, apiSource, max);
    this.setState({
      selected: newSelected,
      selectAll: !selectAll,
    });
  }

  searchOncancel = () => {
    const { apiSource } = this.state;
    this.setState({
      search: '',
      curDataSource: apiSource,
    });
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


  render() {
    const {
      location, history, dispatch,
    } = this.props;
    const someProps = {
      location,
      history,
      dispatch,
    };
    const { selected, multiple, curDataSource, search,
      singleSelected } = this.state;
    const selectedData = selected.data;
    const depSn = curDataSource.map(item => item.id);
    const checkAble = selectedData.filter(item =>
      depSn.indexOf(item.id) > -1).length === curDataSource.length && curDataSource.length;
    return (
      <div className={[styles.con, style.sel_person].join(' ')}>
        <PersonContainer
          multiple={multiple}
          name="text"
          search={search}
          singleSelected={singleSelected}
          checkAble={checkAble}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
          handleDelete={this.getSelectResult}
        >
          <ApiItem
            {...someProps}
            link=""
            name="value"
            renderName="text"
            singleSelected={singleSelected}
            multiple={multiple}
            selected={selectedData}
            dataSource={curDataSource}
            onRefresh={this.onRefresh}
            onChange={this.getSelectResult}
          />

        </PersonContainer>
      </div>
    );
  }
}
