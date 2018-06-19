import React, {
  Component,
} from 'react';
import Animate from 'rc-animate';
import style from './index.less';
import styles from '../../routes/common.less';

class ListFilter extends Component {
  state = {
    enter: true,
    destroyed: false,
    visible: false,
    exclusive: false,

  }

  selFilter = (feild) => { // 筛选
    this.setState({
      [feild]: !this.state[feild],
    });
  }
  render() {
    const {
      children,
      onOk,
      onCancel,
      onResetForm,
      visible,
      filterKey,
      contentStyle,
    } = this.props;
    const conStyle = {
      display: visible ? 'block' : 'none',
      ...contentStyle,
    };
    return (
      <Animate
        component=""
        exclusive={this.state.exclusive}
        showProp="visible"
        transitionAppear
        transitionName="fade"
      >
        <div
          style={conStyle}
          onClick={e => onCancel(e, filterKey)}
        >
          <div className={style.filter_con}>
            <div className={styles.con}>
              <div className={styles.header}>
                <p className={style.title}>筛选</p>
              </div>
              <div
                className={styles.con_content}
                onClick={(e) => { e.stopPropagation(); return false; }}
              >
                {children}
              </div>
              <div
                className={styles.footer}
                style={{ background: '#f8f6f6' }}
              >
                <a onClick={() => { onResetForm(); }}><span> 重置</span></a>
                <a
                  onClick={() => {
                    onOk(filterKey);
                  }}
                ><span>确定</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Animate>
    );
  }
}

export default ListFilter;

