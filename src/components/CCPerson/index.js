import React from 'react';
import { PersonIcon } from '../index';
import style from './index.less';

export default class CCPerson extends React.Component {
  render() {
    const { cc, styles } = this.props;
    if (cc && cc.length === 0) return null;
    if (!cc) return null;
    return (
      <div style={{ ...styles }}>
        <p className={style.grid_opt}>抄送人</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', background: '#fff', padding: '0.4rem' }}>
          {(cc || []).map((c, i) => {
            const idx = i;
            return (
              <PersonIcon
                key={idx}
                nameKey="staff_name"
                value={c}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
CCPerson.defaultProps = {
  cc: [],
};

