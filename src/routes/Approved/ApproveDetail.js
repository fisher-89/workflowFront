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
  FormDetail,
} from '../../components';
import spin from '../../components/General/Loader';

import style from '../TableEdit/index.less';
import styles from '../common.less';

const {
  prompt,
} = Modal;
class ApproveDetail extends Component {
  state = {
    flowId: '',
  }
  componentWillMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { id } = params;
    this.setState({
      flowId: id,
    });
    localStorage.flowId = id;
    dispatch({
      type: 'approve/getStartFlow',
      payload: {
        flow_id: id,
      },
    });
  }
  getGridItem = (key) => {
    const {
      approve: { gridformdata, startflow },
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
          className={style.grid_list_item}
          key={idx}
          onClick={() => this.toEditGrid(key, idx)}
        >
          {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
          {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
          {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
        </div>
      );
    });
  }
  getThrough = () => {
    const {
      dispatch,
    } = this.props;
    const {
      flowId,
    } = this.state;
    dispatch({
      type: 'approve/getThrough',
      payload: {
        flow_id: flowId,
      },
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


  toEditGrid = (key, i) => {
    const {
      approve,
      history,
    } = this.props;
    const {
      startflow,
    } = approve;
    let url = `/approve_grid/${key}/${i}`;
    if (startflow.step_run.action_type === 0) {
      // this.childComp.saveData();
      this.saveData();
      url = `/approve_grid_edit/${key}/${i}`;
    }
    history.push(url);
  }
  // 保存到modal
  saveData = () => {
    const { formdata } = this.childComp.state;
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
    return formdata;
  }
  submitStep = (v, data) => {
    const {
      dispatch,
      history,
    } = this.props;
    const params = {
      step_run_id: data.step_run_id,
      timestamp: data.timestamp,
      next_step: [],
    };
    dispatch({
      type: 'approve/getThrough',
      payload: {
        data: {
          ...params,
          remark: v,
        },
        id: data.flow_id,
        cb: (datas) => {
          dispatch({
            type: 'list/updateLists',
            payload: {
              data: datas,
              start: '/approvelist_processing',
              end: '/approvelist_approved',
            },
          });
          history.goBack(-1);
        },
      },
    });
  }
// 提交数据
submitData = (e) => {
  e.preventDefault();
  const { flowId } = this.state;
  const { dispatch, history } = this.props;
  const { formdata } = this.childComp.state;
  // setTimeout(() => {
  const { approve: { gridformdata, startflow } } = this.props;
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
      cb: (data) => {
        if (data.step_end === 1) { // 不选步骤
          prompt('填写备注', '', [{
            text: '取消',
          }, {
            text: '确定',
            onPress: v => this.submitStep(v, data),
          }], 'default', null, ['请输入备注']);
        } else {
          history.push('/select_step');
        }
      },
    },
  });
  // }, 500);
}

fillRemark = () => {
  prompt('填写备注', '', [{
    text: '取消',
    // onPress: this.submitStep
  }, {
    text: '确定',
    onPress: this.doReject,
  }], 'default', null, ['input your name']);
}
doReject = (v) => {
  const {
    dispatch,
  } = this.props;
  const {
    flowId,
  } = this.state;
  dispatch({
    type: 'approve/doReject',
    payload: {
      step_run_id: flowId,
      remark: v,
    },
  });
}

doDeliver = () => { // 转交
  const {
    history,
  } = this.props;
  history.push('/sel_person/deliver/2/approve');
}
render() {
  const {
    approve,
    dispatch, loading,
  } = this.props;
  const {
    startflow,
    formdata,
  } = approve;
  const newFormData = approve.form_data;
  spin(loading);
  if (!startflow) return null;
  const {
    fields: {
      form,
    },
  } = startflow;
  // 只需要展示的（不包括可编辑的）
  const showForm = form.filter(item => !(startflow.step.hidden_fields.indexOf(item.key) !== -1));

  // 可编辑的
  const editableForm = form.filter((item) => {
    return startflow.step.editable_fields.indexOf(item.key) !== -1;
  });

  return (
    <div className={styles.con}>
      <div className={styles.con_content}>
        {startflow.step_run.action_type === 0 ? (
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
        ) : (
          <FormDetail
            form_data={newFormData}
            show_form={showForm}
          />
          )}

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
        {startflow.step_run.action_type === 0 ? (
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
  approve,
  start,
  loading,
}) => ({
  approve,
  start,
  loading: loading.global,
}))(ApproveDetail);
