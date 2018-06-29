// 发起页面
import React, {
  Component,
} from 'react';
import {
  List,
  Button,
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

class TableEdit extends Component {
  componentWillMount() {
    const {
      dispatch,
    } = this.props;
    const id = analyzePath(this.props.location.pathname, 1);
    this.setState({
      flowId: id,
    });
    dispatch({
      type: 'start/getStartFlow',
      payload: id,
    });
  }

  // 列表控件内部fields
  getGridItem = (key) => {
    const {
      start,
    } = this.props;
    const {
      gridformdata,
    } = start;
    const gridItem = gridformdata.find(item => item.key === key);
    const dataList = (gridItem ? gridItem.fields : []).map((item) => {
      const fieldsItem = item;
      const newObj = {};
      let num = 0;
      fieldsItem.map((its) => { // 取前三个字段
        if (num < 3 && its.type !== 'file' && its.type !== 'array') {
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
        <List.Item
          key={idx}
          arrow="horizontal"
          thumb={item.icon}
          multipleLine
          onClick={() => this.toEditGrid(`/addgridlist/${key}/${i}`)}
        >
          {item.value_0}
          <List.Item.Brief>{item.value_1}</List.Item.Brief>
          <List.Item.Brief>{item.value_2}</List.Item.Brief>
        </List.Item>
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
        <div key={item.key}>
          <p className={style.title}>
            <span>{item.name}</span>
            <Button
              size="small"
              type="primary"
              onClick={() => this.addGridList(item.key)}
            >添加{item.name}
            </Button>
          </p>
          <List key={item.key}>
            {this.getGridItem(item.key)}
          </List>
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
  }
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
  }

  render() {
    const {
      start,
      dispatch,
    } = this.props;
    const {
      startflow,
      formdata,
    } = start;
    const formData = start.form_data;
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
        <div className={styles.con_content}>
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
          {this.getGridList()}
        </div>
        <div className={styles.footer}>
          <a onClick={this.submitData} ><span>确定</span></a>
        </div>
      </div>
    );
  }
}
export default connect(({
  start,
}) => ({
  start,
}))(TableEdit);
