import React from 'react';
import style from './index.less';

class PersonAdd extends React.Component {
  render() {
    const { handleClick } = this.props;
    return (
      <div className={style.person_item}>
        <div className={[style.person_icon, style.spe].join(' ')} onClick={handleClick}>
          <div className={style.name} style={{ borderRadius: '50%', border: '1px dotted rgb(136,136,136)' }}>
            <img
              style={{ width: '12px' }}
              src="/img/add.png"
              alt="添加"
            />
          </div>
        </div>
      </div>
    );
  }
}


export default PersonAdd;
