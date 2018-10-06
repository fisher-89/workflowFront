import React from 'react';
import PersonIcon from '../PeronIcon/PersonIcon';
import style from './index.less';

class PersonInfo extends React.Component {
  render() {
    const { userInfo } = this.props;
    return (
      <div className={style.header_info}>
        <div className={style.ranking_user_info}>
          <PersonIcon
            value={userInfo}
            footer={false}
            nameKey="realname"
            itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
          />
          <div className={style.cur_info}>
            <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
            <p style={{ fontSize: '12px' }}>{userInfo.department_name}/{userInfo.brand_name}</p>
            {userInfo.shop_name && <p style={{ fontSize: '12px' }}>{userInfo.shop_name}使肌肤的基本符合的白癜风是减肥的规范的国际法版本的健康法规是否</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default PersonInfo;
