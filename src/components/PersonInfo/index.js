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
            <p style={{ fontSize: '12px' }}><span>{userInfo.department_name}/{userInfo.brand_name}</span></p>
            {userInfo.shop_name && (
            <p style={{ fontSize: '12px' }}>
              <span>{userInfo.shop_name}</span>
            </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default PersonInfo;
