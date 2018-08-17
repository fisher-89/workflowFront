// 发起页面
import React, { Component } from 'react';
import {
  Button, WhiteSpace,
} from 'antd-mobile';
import { connect } from 'dva';
import spin from '../../components/General/Loader';
import { CreateForm } from '../../components';
import style from './index.less';
import styles from '../common.less';

class TableEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowId: props.match.params.id, // 发起的流程ID
    };
  }
  componentDidMount() {
    // 获取流程发起的数据
    this.props.dispatch({
      type: 'start/getStartFlow',
      payload: this.state.flowId,
    });
  }

  // 列表控件内部fields
  getGridItem = (key) => {
    const {
      start: { gridformdata, startflow },
    } = this.props;
    const {
      fields: {
        grid,
      },
    } = startflow;

    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    const gridFields = gridItem.fields;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const dataList = (currentGridData ? currentGridData.fields : []).map((item, i) => {
      const newObj = {
        value_0: `${gridItem.name}${i}`,
      };
      let num = 0;
      item.map((its) => { // 取前三个字段
        const [fieldsItem] = gridFields.filter(_ => `${_.key}` === `${its.key}`);
        const { type } = fieldsItem;
        if (num < 3 && type !== 'file' && type !== 'array') {
          newObj[`value_${num}`] = its.value;
          num += 1;
        }
        return true;
      });

      return newObj;
    });
    return dataList.map((item, i) => {
      const idx = i;
      return (
        <div
          className={style.grid_list_item}
          key={idx}
          onClick={() => this.toEditGrid(`/addgridlist/${key}/${i}`)}
        >
          {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
          {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
          {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
        </div>
      );
    });
  }


  // 遍历列表控件
  getGridList = () => {
    const {
      start,
    } = this.props;
    const {
      startflow,
    } = start;
    const {
      fields: {
        grid,
      },
    } = startflow;
    // const editable_grid = getGridFilter(grid, 'editable_fields', startflow.step)
    return grid.map((item) => {
      return (
        <div key={item.key} className={style.grid_item}>
          <p className={style.grid_opt}>
            <span>{item.name}</span>
            <a
              onClick={() => this.addGridList(item.key)}
            >+添加{item.name}
            </a>
          </p>
          {this.getGridItem(item.key)}
        </div>
      );
    });
  }
    // 去编辑列表控件里每条数据
    toEditGrid = (url) => {
      const {
        history,
      } = this.props;
      this.childComp.saveData();
      history.push(url);
    }
  // 给列表控件追加item
  addGridList = (key) => {
    const {
      history,
      dispatch,
    } = this.props;
    this.childComp.saveData();
    dispatch({
      type: 'start/refreshModal',
    });
    history.push(`/addgridlist/${key}/-1`);
  };
  // 每次跳页面保存到modal
  saveData = (formdata) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'start/save',
      payload: {
        key: 'formdata',
        value: formdata,
      },
    });
    return formdata;
  };
  // 提交数据
  submitData = (e) => {
    e.preventDefault();
    const {
      flowId,
    } = this.state;
    const {
      dispatch,
      history,
    } = this.props;
    this.childComp.saveData();
    setTimeout(() => {
      const {
        start,

      } = this.props;
      const {
        // formdata,
        gridformdata,
        formdata,
      } = start;
      // 整理formdata数据
      const formObj = {};
      formdata.map((item) => {
        formObj[item.key] = item.value;
        return item;
      });
      // 整理列表控件数据
      const formgridObj = {};
      gridformdata.map((item) => {
        const { fields } = item;
        const forgridArr = fields.map((its) => {
          const obj = {};
          its.map((it) => {
            obj[it.key] = it.value;
            return true;
          });
          return obj;
        });
        formgridObj[item.key] = [...forgridArr];
        return item;
      });
      const formData = {
        ...formObj,
        ...formgridObj,
      };

      dispatch({
        type: 'start/preSet',
        payload: {
          data: {
            form_data: formData,
          },
          id: flowId,
          preType: 'start',
          cb: () => {
            history.push('/select_step');
          },
        },
      });
    }, 500);
  };

  render() {
    const { start, dispatch, loading } = this.props;
    const {
      startflow,
      formdata,
    } = start;
    const formData = start.form_data;
    spin(loading);

    if (!startflow) return null;
    const {
      fields: {
        form,
      },
    } = startflow;
    // 可编辑的form
    const showForm = form.filter(item => !startflow.step.hidden_fields.includes(item.key));
    const editableForm = form.filter(item => startflow.step.editable_fields.includes(item.key));
    return (
      <div className={styles.con}>
        <div className={styles.con_content} style={{ paddingBottom: '20px' }}>
          <CreateForm
            startflow={startflow}
            formdata={formdata}
            evtClick={this.saveData}
            dispatch={dispatch}
            show_form={showForm}
            editable_form={editableForm}
            form_data={formData}
            onRef={(comp) => { this.childComp = comp; }}
          />
          <WhiteSpace />
          {this.getGridList()}
        </div>
        <div>
          <Button type="primary" onClick={this.submitData}>确定</Button>
        </div>
      </div>
    );
  }
}
export default connect(({
  start, loading,
}) => ({
  start,
  loading: loading.global,
}))(TableEdit);
