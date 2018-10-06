import React from 'react';
import { Button, WhiteSpace, WingBlank, Flex, List } from 'antd-mobile';
import PersonInfo from '../../components/PersonInfo';
import { userStorage } from '../../utils/util';
import style from './index.less';
import styles from '../TableEdit/index.less';


class My extends React.Component {
  toExit = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = `${OA_PATH}/logout?redirect_uri=${OA_PATH}/home`;
  }

  redirectTo = (url) => {
    this.props.history.push(url);
  }

  render() {
    const userInfo = userStorage('userInfo');
    const info = {
      realname: userInfo.realname,
      staff_sn: userInfo.staff_sn,
      department_name: userInfo.department ? userInfo.department.full_name : '',
      brand_name: userInfo.brand ? userInfo.brand.name : '',
      shop_name: userInfo.shop ? userInfo.shop.name : '',
    };
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <PersonInfo userInfo={info} />
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg" className={styles.con_step}>
            <List>
              <List.Item arrow="horizontal" onClick={() => this.redirectTo('/start_list?type=processing')}>我发起的</List.Item>
              <List.Item arrow="horizontal" onClick={() => this.redirectTo('/approvelist?type=processing')}>审批列表</List.Item>
            </List>
          </WingBlank>

          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <Button type="primary" onClick={e => this.toExit(e)}>退出</Button>
          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}

export default My;
