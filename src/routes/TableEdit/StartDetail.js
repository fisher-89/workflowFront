// 审批的表单
import React, {
  Component,
} from 'react';
import {
  connect,
} from 'dva';
import { FormDetail } from '../../components';
import spin from '../../components/General/Loader';
import style from './index.less';
import styles from '../common.less';

class StartDetail extends Component {
  componentWillMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id } = params;
    // const flowId = analyzePath(this.props.location.pathname, 1);
    // const step_id = analyzePath(this.props.location.pathname, 2)
    dispatch({
      type: 'start/getStartDetail',
      payload: id,
    });
  }
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
        value_0: `${gridItem.name}${i + 1}`,
      };
      let num = 0;
      item.map((its) => { // 取前三个字段
        const [fieldsItem] = gridFields.filter(_ => `${_.key}` === `${its.key}`);
        const { type } = fieldsItem || {};
        if (num < 3 && type && type !== 'file' && type !== 'array') {
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
          key={idx}
          className={style.grid_list_item}
          onClick={() => this.toEditGrid(`/start_grid/${key}/${i}`)}
        >
          {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
          {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
          {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
        </div>
      );
    });
  }

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
    return grid.map((item, i) => {
      const idx = i;
      return (
        <div key={idx} className={style.grid_item}>
          <p className={style.grid_opt}>
            <span>{item.name}</span>
          </p>
          {this.getGridItem(item.key)}
        </div>

      );
    });
  }
  toEditGrid = (url) => {
    const {
      history,
    } = this.props;
    // this.childComp.saveData();
    history.push(url);
  }
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
  }
  // 保存到modal
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
  }

  doWithDraw = () => {
    const { dispatch, start: { startflow } } = this.props;
    const flowRun = startflow.flow_run;
    dispatch({
      type: 'start/doWithDraw',
      payload: {
        flow_run_id: flowRun.id,
      },
    });
  }
  render() {
    const {
      start, loading,
    } = this.props;
    const {
      startflow,
    } = start;
    const formData = start.form_data;
    spin(loading);
    if (!startflow) return null;
    const {
      fields: {
        form,
      },
    } = startflow;
    const flowRun = startflow.flow_run;
    // 只需要展示的（不包括可编辑的）
    const showForm = form.filter(item => !startflow.step.hidden_fields.includes(item.key));

    // 可编辑的

    return (
      <div className={styles.con}>
        <div className={styles.con_content}>

          <FormDetail
            form_data={formData}
            show_form={showForm}
          />

          {this.getGridList()}
        </div>
        <div className={styles.footer}>
          {flowRun && flowRun.status === 0 ?
            (
              <a
                onClick={this.doWithDraw}
              >
                <span>撤回</span>
              </a>
          ) : ''}

        </div>
      </div>
    );
  }
}
export default connect(({
  start, loading,
}) => ({
  start, loading: loading.global,
}))(StartDetail);
