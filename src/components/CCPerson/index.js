import React from 'react';
import { PersonIcon } from '../index';
import style from './index.less';

export default class Footer extends React.Component {
  render() {
    const { cc } = this.props;
    if (cc.length === 0) return null;
    return (
      <div style={{ marginBottom: '20px' }}>
        <p className={style.grid_opt}>抄送人</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', background: '#fff', padding: '0.4rem' }}>
          { (cc || []).map((c, i) => {
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
