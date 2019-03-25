// 发起流程填表单页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, SwipeAction, WhiteSpace } from 'antd-mobile';

import spin from '../../components/General/Loader';
import { CreateForm } from '../../components';
import Page400 from '../error/page400';
import { initFormdata, isableSubmit, judgeGridSubmit, dealGridData, makeGridItemData, setNavTitle } from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

class TableEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowId: props.match.params.id, // 发起的流程ID
      formdata: [],
      griddata: [],
    };
  }

  componentWillMount() {
    const { start: { gridformdata, startflow, formdata } } = this.props;
    let griddata = [];
    if (startflow) {
      griddata = dealGridData(gridformdata);
    }
    this.setState({
      griddata,
      formdata,
    });
  }

  componentDidMount() {
    // 获取流程发起的数据
    this.props.dispatch({
      type: 'start/getStartFlow',
      payload: {
        number: this.state.flowId,
        cb: (data) => {
          setNavTitle(data.flow.name);
        },
      },
    });
    this.excuteScrollTo();
  }

  componentWillReceiveProps(props) {
    const { start: { startflow, gridformdata } } = props;
    const oldstartflow = this.props.start.startflow;
    this.excuteScrollTo();
    if ((JSON.stringify(startflow) !== JSON.stringify(oldstartflow)) && startflow) {
      const formData = startflow.form_data;
      const { fields: { form } } = startflow;
      // 可编辑的form
      // const editableForm = form.filter(item =>
      //   startflow.step.editable_fields.indexOf(item.key) !== -1);
      // 可用
      const availableForm = form.filter(item =>
        startflow.step.available_fields.indexOf(item.key) !== -1);
      // const formdata = initFormdata(formData, editableForm);
      const formdata = initFormdata(formData, availableForm);
      const griddata = dealGridData(gridformdata);
      this.setState({
        formdata,
        griddata,
      });
    }
  }

  // 列表控件内部fields
  getGridItem = (key, ableAdd, title) => {
    const { start: { gridformdata, startflow } } = this.props;
    const { fields: { grid } } = startflow;
    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const dataList = makeGridItemData(currentGridData, gridItem);
    const extra = ableAdd ? [
      {
        text: '删除',
        style: { backgroundColor: 'rgb(218,81,85)', minWidth: '1.6rem', color: 'white', fontSize: '12px', borderTopRightRadius: '2px' },
        onPress: 'deleteItem',
      },
    ] : [];
    return dataList.map((item, i) => {
      const idx = i;
      const newExtra = extra.map((_) => {
        const obj = { ..._ };
        obj.onPress = e => this[_.onPress](e, key, i);
        return obj;
      });
      return (
        <SwipeAction
          right={newExtra}
          autoClose={false}
          key={idx}
        >
          <div
            className={style.grid_list_item}
            onClick={() => this.toEditGrid(`/addgridlist/${key}/${i}/${title}`)}
          >
            {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
            {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
            {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
          </div>
        </SwipeAction>
      );
    });
  }

  // 遍历列表控件
  getGridList = () => {
    const { start } = this.props;
    const { startflow } = start;
    const { fields: { grid } } = startflow;

    const availableGrid = grid.filter(item =>
      startflow.step.available_fields.indexOf(item.key) !== -1);
    const editableGrid = availableGrid.filter(item =>
      startflow.step.editable_fields.indexOf(item.key) !== -1);

    const gridKey = editableGrid.map(item => item.key);

    return availableGrid.map((item, i) => {
      const index = i;
      const { key, name } = item;
      const ableAdd = gridKey.indexOf(item.key) > -1;
      return (
        <div key={index} className={style.grid_item} id={key}>
          <p className={style.grid_opt}>
            <span>{name}</span>
            {ableAdd && (
              <a
                onClick={() => this.addGridList(key, name)}
              >+添加{name}
              </a>
            )}
          </p>
          {this.getGridItem(key, ableAdd, name)}
        </div>
      );
    });
  }

  excuteScrollTo = () => {
    const content = document.getElementById('con_content');
    if (content) {
      const { scrollTopDetails, location: { pathname } } = this.props;
      const scrollTop = scrollTopDetails[pathname];
      content.scrollTop = scrollTop;
    }
  }

  saveScrollTop = (height = 0) => {
    const content = document.getElementById('con_content');
    if (content) {
      const { scrollTop } = content;
      this.saveScrolModal((scrollTop - 0) + height);
    }
  }

  saveScrolModal = (scrollTop) => {
    const { dispatch, location: { pathname } } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        store: 'scrollTop',
        id: pathname,
        data: scrollTop,
      },
    });
  }

  handleOnchange = (formdata) => {
    this.setState({
      formdata,
    });
  }

  // 去编辑列表控件里每条数据
  toEditGrid = (url) => {
    const { history } = this.props;
    this.saveData();
    history.push(url);
  }

  deleteItem = (e, key, i) => {
    e.stopPropagation();
    const { start: { gridformdata }, dispatch } = this.props;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const { fields } = currentGridData;
    fields.splice(i, 1);
    currentGridData.fields = fields;
    const newGridformdata = gridformdata.map((item) => {
      let obj = { ...item };
      if (item.key === key) {
        obj = { ...currentGridData };
      }
      return obj;
    });

    dispatch({
      type: 'start/save',
      payload: {
        store: 'gridformdata',
        data: newGridformdata,
      },
    });
  }

  // 给列表控件追加item
  addGridList = (key, title) => {
    const { history, dispatch } = this.props;
    const height = document.getElementById(key).offsetHeight;
    this.saveData(undefined, height);
    dispatch({
      type: 'start/resetGridDefault',
    });
    history.push(`/addgridlist/${key}/-1/${title}`);
  };

  // 每次跳页面保存到modal
  saveData = (formdata) => {
    let newFormData = formdata;
    if (newFormData === undefined) {
      newFormData = this.childComp.state.formdata;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'start/save',
      payload: {
        store: 'formdata',
        data: newFormData,
      },
    });
    this.saveScrollTop();
    return newFormData;
  };

  // 提交数据
  submitData = (e) => {
    e.preventDefault();
    this.saveData();
    // const { flowId } = this.state;
    const { dispatch, history, start: { gridformdata, startflow: { step } } } = this.props;
    const flowId = step.flow_id;
    // const { s} = this.props;
    const { formdata } = this.childComp.state;
    // 整理formdata数据
    const formObj = {};
    formdata.forEach((item) => {
      formObj[item.key] = item.value;
      return item;
    });
    const formgridObj = dealGridData(gridformdata);
    const formData = {
      ...formObj,
      ...formgridObj,
    };

    dispatch({
      type: 'start/preSet',
      payload: {
        data: {
          form_data: formData,
          flow_id: flowId,
        },
        preType: 'start',
        cb: () => {
          // history.push('/select_step');
          history.push('/approve_step');
        },
      },
    });
  };

  render() {
    const { start, dispatch, loading, history, location,
      flowCodeDetails, match: { params } } = this.props;
    const { startflow, formdata } = start;
    const formData = start.form_data;
    const curCode = flowCodeDetails ? flowCodeDetails[params.id] : {};
    spin(loading);
    if (!loading && curCode && curCode.code === 400) {
      return (<Page400 message={curCode.message} />);
    }
    if (!startflow) return null;
    const { fields: { form, grid } } = startflow;
    // 可编辑的form
    // const showForm =
    // form.filter(item => startflow.step.hidden_fields.indexOf(item.key) === -1);
    const availableForm = form.filter(item =>
      startflow.step.available_fields.indexOf(item.key) !== -1);
    const showForm = availableForm.filter(item =>
      startflow.step.hidden_fields.indexOf(item.key) === -1);
    const editableForm = availableForm.filter(item =>
      startflow.step.editable_fields.indexOf(item.key) !== -1);
    const requiredForm = availableForm.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);

    // const requiredGrid = grid.filter(item =>
    //   startflow.step.required_fields.indexOf(item.key) !== -1);
    const availableGrid = grid.filter(item =>
      startflow.step.available_fields.indexOf(item.key) !== -1);
    const requiredGrid = availableGrid.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);
    let ableSubmit = isableSubmit(requiredForm, this.state.formdata)
      && judgeGridSubmit(requiredGrid, this.state.griddata);
    ableSubmit = true;
    return (
      <div className={styles.con}>
        <WhiteSpace size="xl" />
        <div className={styles.con_content} id="con_content">
          <CreateForm
            history={history}
            location={location}
            startflow={startflow}
            formdata={formdata}
            evtClick={this.saveData}
            onChange={this.handleOnchange}
            dispatch={dispatch}
            show_form={showForm}
            availableForm={availableForm}
            editable_form={editableForm}
            required_form={requiredForm}
            form_data={formData}
            onRef={(comp) => { this.childComp = comp; }}
          />
          <div style={{ marginBottom: '20px' }}>
            {this.getGridList()}
          </div>

        </div>
        <div style={{ padding: '10px' }}>
          <Button
            type="primary"
            disabled={!ableSubmit}
            onClick={this.submitData}
          >确定
          </Button>
        </div>
      </div>
    );
  }
}
export default connect(({
  start, loading, common,
}) => ({
  start,
  flowCodeDetails: start.flowCodeDetails,
  scrollTopDetails: common.scrollTopDetails,
  loading: (
    (loading.effects['start/preSet'] || false) ||
    (loading.effects['api/fetchApi'] || false) ||
    loading.effects['start/getStartFlow']
  ),
}))(TableEdit);
