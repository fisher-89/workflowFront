import React, {
  Component,
} from 'react';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import style from './index.less';

const { TweenOneGroup } = TweenOne;

class ListItem extends Component {
  render() {
    const {
      list,
      showProps,
      evtClick,
      convert,
    } = this.props;
    return (
      <QueueAnim
        component="ul"
        animConfig={[
          { opacity: [1, 0], translateY: [0, 30] },
          { height: 0 },
        ]}
        leaveReverse
        ease={['easeOutQuart', 'easeInOutQuart']}
        duration={[550, 450]}
        interval={150}
      >
        {list.map((item, idx) => {
          const i = idx;
          return (
            <li
              key={i}
              onClick={e => evtClick(e, item)}
            >
              <TweenOneGroup >
                <div
                  className={style.appro_item}
                  key={i}
                >
                  <div className={style.appro_des}>
                    <p className={style.appro_title}>
                      {showProps.title instanceof Object ?
                        item[showProps.title.key][showProps.title.child] :
                        item[showProps.title]}
                    </p>
                    <div className={style.info}>
                      <span>
                        {showProps.status instanceof Object ?
                          convert(item[showProps.status.key][showProps.status.child]) :
                          convert(item[showProps.status])}
                      </span>
                    </div>
                  </div>
                  <div className={style.oper}>
                    <span className={style.time}>
                      {showProps.time instanceof Object ?
                       item[showProps.time.key][showProps.time.child] :
                        item[showProps.time]}
                    </span>
                  </div>
                </div>
              </TweenOneGroup>
            </li>
          );
        })}
      </QueueAnim>

    );
  }
}

export default ListItem;

