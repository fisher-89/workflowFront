import React from 'react';
import style from './index.less';

class PersonAdd extends React.Component {
  render() {
    const { handleClick } = this.props;
    return (
      <div className={style.person_item}>
        <div className={[style.person_icon, style.spe].join(' ')} onClick={handleClick}>
          <div className={style.name}>
            <img
              src="/img/default_avatar.png"
              alt="添加"
            />
          </div>
        </div>
      </div>
    );
  }
}


export default PersonAdd;
