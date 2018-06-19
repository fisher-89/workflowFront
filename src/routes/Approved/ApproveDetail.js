// 审批的表单
import React, {
  Component,
} from 'react';
import {
  List,
  Modal,
} from 'antd-mobile';
import {
  connect,
} from 'dva';
import {
  CreateForm,
} from '../../components';
import {
  analyzePath,
} from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

const { prompt } = Modal;
class ApproveDetail extends Component {
  state = {
    flowId: '',
  }
  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    const flowId = analyzePath(this.props.location.pathname, 1);
    this.setState({
      flowId,
    });
    // const step_id = analyzePath(this.props.location.pathname, 2)
    dispatch({
      type: 'approve/getStartFlow',
      payload: {
        flow_id: flowId,
      },
    });
  }
  getGridItem = (key) => {
    const {
      approve,
    } = this.props;
    const {
      gridformdata,
    } = approve;
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
          onClick={() => this.toEditGrid(`/approve_grid/${key}/${i}`)}
        >
          {item.value} <List.Item.Brief key={idx}>{item.text}</List.Item.Brief>
        </List.Item>
      );
    });
  }
  getThrough = () => {
    const { dispatch } = this.props;
    const { flowId } = this.state;
    dispatch({
      type: 'approve/getThrough',
      payload: { flow_id: flowId },
    });
  }
  getGridList = () => {
    const {
      approve,
    } = this.props;
    const {
      startflow,
    } = approve;
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
    this.childComp.saveData();
    history.push(url);
  }
  // 保存到modal
  saveData = (formdata) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'approve/save',
      payload: {
        key: 'formdata',
        value: formdata,
      },
    });
  }
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
    const {
      approve,
    } = this.props;
    const {
      formdata,
      gridformdata,
      startflow,
    } = approve;
    // 整理formdata数据
    const flowRun = startflow.flow_run;
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
    const newformData = {
      ...formObj,
      ...formgridObj,
    };
    dispatch({
      type: 'start/preSet',
      payload: {
        data: {
          form_data: newformData,
          step_run_id: flowId,
        },
        id: flowRun.flow_id,
        preType: 'approve',
        cb: () => {
          history.push('/select_step');
        },
      },
    });
  }

  fillRemark = () => {
    prompt('填写备注', '',
      [
        {
          text: '取消',
          // onPress: this.submitStep
        },
        {
          text: '确定',
          onPress: this.doReject,
        },
      ], 'default', null, ['input your name']);
  }
  doReject = (v) => {
    const { dispatch } = this.props;
    const { flowId } = this.state;
    dispatch({
      type: 'approve/doReject',
      payload: {
        step_run_id: flowId,
        remark: v,
      },
    });
  }
  addGridList = (key) => {
    const {
      history,
      dispatch,
    } = this.props;
    this.childComp.saveData();
    dispatch({
      type: 'approve/refreshModal',
    });
    history.push(`/addgridlist/${key}/-1`);
  }
  doDeliver = () => { // 转交
    const { dispatch } = this.props;
    const {
      flowId,
    } = this.state;
    dispatch({
      type: 'approve/doDeliver',
      payload: {
        step_run_id: flowId,
        deliver: [{
          approver_sn: 110103,
          approver_name: '刘勇01',
        },
        {
          approver_sn: 110105,
          approver_name: '张博涵',
        }],
      },
    });
  }
  render() {
    const {
      approve,
      dispatch,
    } = this.props;
    const {
      startflow,
      formdata,
    } = approve;
    const newFormData = approve.form_data;
    if (!startflow) return null;
    const {
      fields: {
        form,
      },
    } = startflow;
    // 只需要展示的（不包括可编辑的）
    const showForm = form.filter(item => !startflow.step.hidden_fields.includes(item.key));

    // 可编辑的
    const editableForm = showForm.filter(item =>
      startflow.step.editable_fields.includes(item.key)
    );

    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <CreateForm
            startflow={startflow}
            formdata={formdata}
            evtClick={this.saveData}
            dispatch={dispatch}
            show_form={showForm}
            editable_form={editableForm}
            form_data={newFormData}
            onRef={(comp) => { this.childComp = comp; }}
          />
          {this.getGridList()}
        </div>
        <div className={styles.footer}>
          {startflow.step_run.action_type === 0 ? (
            <a
              onClick={this.submitData}
            >
              <span>通过</span>
            </a>
) : ''}
          {startflow.step_run.action_type === 2 ? (
            <a
              onClick={this.doDeliver}
            >
              <span>转交</span>
            </a>
) : ''}
          {startflow.step.reject_type !== 0 && startflow.step_run.action_type === 0 ? (
            <a
              onClick={this.fillRemark}
            >
              <span>驳回</span>
            </a>
) : ''}
        </div>
      </div>
    );
  }
}
export default connect(({
  approve, start,
}) => ({
  approve, start,
}))(ApproveDetail);
