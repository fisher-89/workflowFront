import React from 'react';
import { connect } from 'dva';
import {
  Grid, WhiteSpace, WingBlank,
} from 'antd-mobile';
import style from './index.less';
import { userStorage } from '../../utils/util';
import listIcon from '../../../src/assets/img/icon.png';

class IndexPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'start/resetStart',
    });
    this.props.dispatch({
      type: 'approve/resetStart',
    });
    this.props.dispatch({
      type: 'list/resetModal',
    });
  }
  render() {
    const { history } = this.props;
    let flowList = userStorage('flowList');
    if (!(flowList instanceof Array)) {
      flowList = [];
    }
    const flowListData = [...flowList];// 可发起的流程列表数据
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
        <WhiteSpace size="md" />
        <WingBlank>
          <div className={style.entrance}>
            <Grid
          // 我发起的
              square={false}
              data={startList}
              hasLine={false}
              onClick={() => history.push('/start_list?type=processing&page=1')}
            />
          </div>
        </WingBlank>
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
                <WhiteSpace size="md" />
                <WingBlank>
                  <div className={style.entrance}>
                    <div className={style.title}>{item.name}</div>
                    <Grid
                      data={data}
                      square={false}
                      onClick={el => history.push(`/table_edit/${el.id}`)}
                      activeStyle={{ background: '#f5f5f5' }}
                      hasLine={false}
                    />
                  </div>
                </WingBlank>
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
