// 审批的表单
import React, {
  Component,
} from 'react';
import {
  List,
} from 'antd-mobile';
import {
  connect,
} from 'dva';
import {
  FormDetail,
} from '../../components';
import {
  analyzePath,
} from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

class StartDetail extends Component {
  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    const flowId = analyzePath(this.props.location.pathname, 1);
    // const step_id = analyzePath(this.props.location.pathname, 2)
    dispatch({
      type: 'start/getStartDetail',
      payload: flowId,
    });
  }
  getGridItem = (key) => {
    const {
      start,
    } = this.props;
    const {
      gridformdata,
    } = start;
    const gridItem = gridformdata.find(item => item.key === key);
    const dataList = (gridItem ? gridItem.fields : []).map((item) => {
      return item.find(its => its.key === 'description');
    });

    return dataList.map((item, i) => {
      const idx = i;
      return (
        <List.Item
          key={idx}
          arrow="horizontal"
          thumb={item.icon}
          multipleLine
          onClick={() => this.toEditGrid(`/start_grid/${key}/${i}`)}
        >
          {item.value} <List.Item.Brief>{item.text}</List.Item.Brief>
        </List.Item>
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
        <div key={idx}>
          <p className={style.title}>
            <span>{item.name}</span>
          </p>
          <List key={item.key}>
            {this.getGridItem(item.key)}
          </List>
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
      start,
    } = this.props;
    const {
      startflow,
    } = start;
    const formData = start.form_data;
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
  start,
}) => ({
  start,
}))(StartDetail);
