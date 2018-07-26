import React from 'react';
import { connect } from 'dva';
import {
  Grid,
} from 'antd-mobile';
import style from './index.less';
import listIcon from '../../../src/assets/img/icon.png';

class IndexPage extends React.Component {
  componentDidMount() {
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
    const { common, history } = this.props;
    const flowListData = [...common.flowList];// 可发起的流程列表数据
    const startList = [
      {
        text: '我发起的',
        icon: listIcon,
        id: '-1',
        description: '这是发起的列表',
      },
    ];
    return (
      <div>
        <Grid
          // 我发起的
          data={startList}
          hasLine={false}
          onClick={() => history.push('/start_list')}
        />
        {
          // 可发起的流程
          flowListData.map((item) => {
            const data = item.flow.map((i) => {
              const obj = {};
              obj.icon = listIcon;
              obj.text = i.name;
              obj.id = i.id;
              obj.description = i.description;
              return obj;
            });
            return (
              <div key={item.id}>
                <div className={style.subTitle}>{item.name}</div>
                <Grid
                  data={data}
                  onClick={el => history.push(`/table_edit/${el.id}`)}
                  activeStyle={{ background: '#f5f5f5' }}
                  hasLine={false}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

IndexPage.propTypes = {};

export default connect(({ common }) => ({
  common,
}))(IndexPage);
