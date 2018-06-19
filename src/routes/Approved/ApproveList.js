// 审批列表

import React, {
  Component,
} from 'react';
import {
  connect,
} from 'dva';
import {
  Tabs,
  PullToRefresh,
} from 'antd-mobile';
import {
  Nothing,
  ListFilter,
  CheckBoxs,
} from '../../components/index';
import {
  ListView,
} from '../../components/ListView/index.js';
import nothing from '../../assets/nothing.png';
import filterImg from '../../assets/filter.svg';
import checkFilterImg from '../../assets/checkFilter.svg';

import {
  approvalState, getApprState,
} from '../../utils/convert';
import styles from '../common.less';
import style from './index.less';
import './reset.less';

let startX;
let startY;
class ApproveList extends Component {
  state = {
    refreshing: false,
    direction: 'down',
    type: 'all',
    enter: true,
    destroyed: false,
    visible: false,
    exclusive: false,
    filter: {
      flowTypeId: [],
    },
  }
  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'approve/getApproList',
      payload: {
        parms: {
          type: 'all',
          page: 1,
        },
        refresh: true,
      },
    });
  }
  onRefresh = () => {
    const {
      dispatch,
    } = this.props;
    const {
      type,
    } = this.state;
    dispatch({
      type: 'approve/getApproList',
      payload: {
        parms: {
          type,
          page: 1,
        },
        refresh: true,
      },
    });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 1000);
  }
  onFilterOk = (feild) => { // sh
    const {
      type,
      filter: {
        flowTypeId,
      },
    } = this.state;
    const {
      dispatch,
      approve,
    } = this.props;
    const data = approve.statusData[type];
    this.setState({
      [feild]: !this.state[feild],
    }, () => {
      dispatch({
        type: 'common/save',
        payload: {
          key: 'footStyle',
          value: {
            display: '',
          },
        },
      });
    });
    dispatch({
      type: 'approve/getApproList',
      payload: {
        parms: {
          type,
          page: data.current_page,
          flow_type_id: flowTypeId,

        },
        refresh: true,
      },
    });
  }
  onResetForm = () => {
    this.setState({
      filter: { flowTypeId: [] },
    });
  }
  onCancel = (e, feild) => {
    const {
      dispatch,
    } = this.props;
    this.setState({
      [feild]: !this.state[feild],
    }, () => {
      dispatch({
        type: 'common/save',
        payload: {
          key: 'footStyle',
          value: {
            display: '',
          },
        },
      });
    });
  }
  // 返回角度
  GetSlideAngle = (dx, dy) => {
    // Math.atan2返回弧度值
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }
  // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
  GetSlideDirection = (sX, sY, endX, endY) => {
    const dy = sY - endY;
    const dx = endX - sX;
    let result = 0;
    // 如果滑动距离太短
    // if (Math.abs(dx) < 2 && Math.abs(dy) < 16) {
    //   return result;
    // }
    // 距离小于16，
    if (((dx * dx) + (dy * dy)) < 256) {
      return result;
    }
    // 判断方向
    const angle = this.GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
      result = 4;
    } else if (angle >= 45 && angle < 135) {
      result = 1;
    } else if (angle >= -135 && angle < -45) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    }

    return result;
  }
  doLoadMore = (str) => {
    const {
      type,
      filter: {
        flowTypeId,
      },
    } = this.state;
    const {
      dispatch,
      approve,
    } = this.props;
    const data = approve.statusData[type];
    if (str === 'up') {
      if (data.current_page === data.last_page) {
        return;
      }
      dispatch({
        type: 'approve/getApproList',
        payload: {
          parms: {
            type,
            page: data.current_page + 1,
            flow_type_id: flowTypeId,
          },
        },
      });
    }
  }
  handleStart = (ev) => {
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
  }

  handleEnd = (ev) => {
    const self = this;
    const endX = ev.changedTouches[0].pageX;
    const endY = ev.changedTouches[0].pageY;
    const direction = this.GetSlideDirection(startX, startY, endX, endY);
    switch (direction) {
      case 0:
        self.doLoadMore('no');
        break;
      case 1:
        self.doLoadMore('up');
        break;
      case 2:
        self.doLoadMore('down');
        break;
      case 3:
        self.doLoadMore('left');
        break;
      case 4:
        self.doLoadMore('right');
        break;
      default:
    }
  }
  appvalDetail = (e, item) => {
    const {
      history,
    } = this.props;
    history.push(`/approve/${item.id}`);
  }


  statusChange = (tab) => { // tab切换
    const {
      dispatch,
      approve,
    } = this.props;
    const {
      statusData,
    } = approve;
    const list = statusData[tab.type].data;
    this.setState({
      type: tab.type,
    });
    if (list && list.length) {
      return;
    }
    dispatch({
      type: 'approve/getApproList',
      payload: {
        parms: {
          type: tab.type,
        },
        refresh: false,
      },
    });
  }
  selFilter = (feild) => { // 筛选
    const {
      dispatch,
    } = this.props;
    this.setState({
      [feild]: !this.state[feild],
    }, () => {
      dispatch({
        type: 'common/save',
        payload: {
          key: 'footStyle',
          value: {
            display: 'none',
          },
        },
      });
    });
  }

  checkFlows = (i, v) => { // 流程
    const {
      filter,
    } = this.state;
    const {
      flowTypeId,
    } = filter;
    let newFlowTypeId = [...flowTypeId];
    if (flowTypeId.includes(v)) {
      newFlowTypeId = flowTypeId.filter(item => item !== v);
    } else {
      newFlowTypeId = flowTypeId.concat(v);
    }
    const newFilter = { ...filter,
      flowTypeId: newFlowTypeId,
    };
    this.setState({
      filter: newFilter,
    });
  }
  renderContent = (tab) => {
    const {
      approve,
    } = this.props;
    const {
      statusData,
    } = approve;
    const list = statusData[tab].data;
    const showProps = {
      title: {
        key: 'flow_run',
        child: 'name',
      },
      status: 'action_type',
      time: 'created_at',
    };
    if (list && !list.length) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
          <Nothing src={nothing} />
        </div>
      );
    }

    return (
      <PullToRefresh
        ref={(el) => { this.ptr = el; }}
        style={{
          height: '100%',
          overflow: 'auto',
        }}
        direction={this.state.direction}
        refreshing={this.state.refreshing}
        onRefresh={
          this.onRefresh
        }
      >
        <div
          style={{ display: 'flex', flexDirection: 'column' }}
          onTouchStart={this.handleStart}
          onTouchEnd={this.handleEnd}
        >
          <ListView
            list={list}
            showProps={showProps}
            evtClick={this.appvalDetail}
            convert={getApprState}
          />
        </div>
      </PullToRefresh>
    );
  }
  render() {
    const {
      common,
    } = this.props;
    const {
      flowList,
    } = common;
    const { filter } = this.state;
    const { flowTypeId } = filter;
    const flowOption = flowList.map((item) => {
      return {
        value: item.id,
        name: item.name,
      };
    });
    return (
      <div className={styles.con}>
        <div className={style.con_list}>
          <Tabs
            tabs={approvalState}
            renderTabBar={props => (
              <Tabs.DefaultTabBar
                {...props}
                page={4}
              />
)}
            onChange={this.statusChange}
            initialPage={0}
          >
            {this.renderContent(this.state.type)}
          </Tabs>
          <div className={style.img}>
            <i />
            <img
              src={flowTypeId && flowTypeId.length ? checkFilterImg : filterImg}
              style={{ width: '0.533rem', height: '0.533rem' }}
              alt=""
              onClick={() => this.selFilter('visible')}
            />
          </div>
        </div>
        <ListFilter
          onOk={this.onFilterOk}
          filterKey="visible"
          onCancel={this.onCancel}
          onResetForm={this.onResetForm}
          iconStyle={{ width: '0.533rem', height: '0.533rem' }}
          visible={this.state.visible}
          contentStyle={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                textAlign: 'left',
                backgroundColor: 'rgba(0,0,0,0.2)',
                paddingLeft: '2rem',
              }}
        >

          <div className={style.filter_item}>
            <div className={style.title}>流程</div>
            <CheckBoxs
              option={flowOption}
              checkStatus={(i, v) => this.checkFlows(i, v)}
              value={this.state.filter.flowTypeId}
            />
          </div>

        </ListFilter>
      </div>
    );
  }
}
export default connect(({
  approve,
  loading,
  common,
}) => ({
  approve,
  loading,
  common,
}))(ApproveList);
