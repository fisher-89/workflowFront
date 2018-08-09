import React from 'react';
import PersonIcon from '../PeronIcon/PersonIcon';
import {
  userStorage,
} from '../../utils/util';
import style from './index.less';

class PersonInfo extends React.Component {
  render() {
    const userInfo = userStorage('userInfo');
    return (
      <div className={style.header_info}>
        <div className={style.ranking_user_info}>
          <PersonIcon
            value={userInfo}
            footer={false}
            nameKey="realname"
            itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
          />
          <div>
            <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
            <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{userInfo.department && userInfo.department.full_name}/{userInfo.brand && userInfo.brand.name}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonInfo;
