import React from 'react';
import {
  connect,
} from 'dva';
import {
  Grid,
} from 'antd-mobile';

class IndexPage extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'common/getFlowList',
    });
    this.props.dispatch({
      type: 'start/resetStart',
    });
    this.props.dispatch({
      type: 'approve/resetStart',
    });
  }
  render() {
    const {
      common,
      history,
    } = this.props;
    const {
      flowList,
    } = common;
    const indexGrid = [...flowList];
    const startList = {
      name: '申请列表',
      id: '-1',
      description: '这是申请列表',
    };
    indexGrid.unshift(startList);
    const data = indexGrid.map((item) => {
      const obj = {};
      obj.icon = 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png';
      obj.text = item.name;
      obj.id = item.id;
      obj.description = item.description;
      return obj;
    });
    return (
      <div>
        <Grid
          data={data}
          onClick={el => history.push(el.id === '-1' ? '/start_list' : `/table_edit/${el.id}`)}
          activeStyle={{ background: '#f5f5f5' }}
        />
      </div>
    );
  }
}

IndexPage.propTypes = {};

export default connect(({
  common,
}) => ({
  common,
}))(IndexPage);
