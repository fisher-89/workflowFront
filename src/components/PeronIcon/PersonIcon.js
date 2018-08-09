import React from 'react';

import style from './index.less';

class PersonIcon extends React.Component {
  // type标志有无删除
  render() {
    const {
      showNum = 2,
      handleClick,
      handleDelClick,
      footer = true,
      itemStyle = {},
      value = {},
      nameKey,
    } = this.props;
    const name = value[nameKey] ? value[nameKey] : '';
    const newName = name.slice(name.length - (name.length < showNum ? name.length : showNum));
    return (
      <div
        className={style.person_item}
        style={itemStyle}
        onClick={handleClick ? () => handleClick(value) : null}
      >
        <div className={style.person_icon}>
          <div className={style.name}>
            {newName}
            {handleDelClick ? <span onClick={e => handleDelClick(e, value)} /> : null}
          </div>
        </div>
        {footer ? <div className={style.user_info}>{name}</div> : null}

      </div>
    );
  }
}


export default PersonIcon;
