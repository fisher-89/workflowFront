// 发起页面
import React, { Component } from 'react';
import { Button, SwipeAction, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import spin from '../../components/General/Loader';
import { CreateForm } from '../../components';
import { initFormdata, isableSubmit, judgeGridSubmit, dealGridData, makeGridItemData } from '../../utils/util';
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
      payload: this.state.flowId,
    });
  }

  componentWillReceiveProps(props) {
    const { start: { startflow, gridformdata } } = props;
    const oldstartflow = this.props.start.startflow;
    if ((JSON.stringify(startflow) !== JSON.stringify(oldstartflow)) && startflow) {
      const formData = startflow.form_data;
      const { fields: { form } } = startflow;
      // 可编辑的form
      const editableForm = form.filter(item =>
        startflow.step.editable_fields.indexOf(item.key) !== -1);
      const formdata = initFormdata(formData, editableForm);
      const griddata = dealGridData(gridformdata);
      this.setState({
        formdata,
        griddata,
      });
    }
  }

  // 列表控件内部fields
  getGridItem = (key, ableAdd) => {
    const { start: { gridformdata, startflow } } = this.props;
    const { fields: { grid } } = startflow;
    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    // const gridFields = gridItem.fields;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    // const dataList = (currentGridData ? currentGridData.fields : []).map((item, i) => {
    //   const newObj = {
    //     value_0: `${gridItem.name}${i + 1}`,
    //   };
    //   let num = 0;
    //   item.map((its) => { // 取前三个字段
    //     const [fieldsItem] = gridFields.filter(_ => `${_.key}` === `${its.key}`);
    //     const { type } = fieldsItem || {};
    //     if (num < 3 && type && type !== 'file' && type !== 'array') {
    //       newObj[`value_${num}`] = its.value;
    //       num += 1;
    //     }
    //     return true;
    //   });
    //   return newObj;
    // });
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
            onClick={() => this.toEditGrid(`/addgridlist/${key}/${i}`)}
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
    const editableGrid = grid.filter(item =>
      startflow.step.editable_fields.indexOf(item.key) !== -1);
    const gridKey = editableGrid.map(item => item.key);
    return grid.map((item, i) => {
      const index = i;
      const { key, name } = item;
      const ableAdd = gridKey.indexOf(item.key) > -1;
      return (
        <div key={index} className={style.grid_item}>
          <p className={style.grid_opt}>
            <span>{name}</span>
            {ableAdd && (
              <a
                onClick={() => this.addGridList(key)}
              >+添加{name}
              </a>
            )}
          </p>
          {this.getGridItem(key, ableAdd)}
        </div>
      );
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
  addGridList = (key) => {
    const { history, dispatch } = this.props;
    this.saveData();
    dispatch({
      type: 'start/resetGridDefault',
    });
    history.push(`/addgridlist/${key}/-1`);
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
    return newFormData;
  };

  // 提交数据
  submitData = (e) => {
    e.preventDefault();
    const { flowId } = this.state;
    const { dispatch, history } = this.props;
    const { start: { gridformdata } } = this.props;
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
        // id: flowId,
        preType: 'start',
        cb: () => {
          history.push('/select_step');
        },
      },
    });
  };

  render() {
    const { start, dispatch, loading, history, fileLoading } = this.props;
    const { startflow, formdata } = start;
    const formData = start.form_data;
    spin(loading || fileLoading, fileLoading ? '上传中' : '加载中');
    if (!startflow) return null;
    const { fields: { form, grid } } = startflow;
    // 可编辑的form
    const showForm = form.filter(item => startflow.step.hidden_fields.indexOf(item.key) === -1);
    const editableForm = form.filter(item =>
      startflow.step.editable_fields.indexOf(item.key) !== -1);
    const requiredForm = form.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);
    const requiredGrid = grid.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);
    let ableSubmit = isableSubmit(requiredForm, this.state.formdata)
      && judgeGridSubmit(requiredGrid, this.state.griddata);
    ableSubmit = true;
    return (
      <div className={styles.con}>
        <WhiteSpace size="xl" />

        <div className={styles.con_content}>
          <CreateForm
            history={history}
            startflow={startflow}
            formdata={formdata}
            evtClick={this.saveData}
            onChange={this.handleOnchange}
            dispatch={dispatch}
            show_form={showForm}
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
  start, loading,
}) => ({
  start,
  loading: loading.effects['start/getStartFlow'] || loading.effects['api/fetchApi'],
  fileLoading: loading.effects['start/fileUpload'],
}))(TableEdit);
