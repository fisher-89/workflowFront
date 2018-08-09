import React from 'react';
import styles from './Loader.less';

export default class SmallLoader extends React.PureComponent {
  render() {
    // const { spinning, fullScreen } = this.props;
    return (
      <div className={styles.circle}>
        <div className={styles.cir} />
      </div>
    );
  }
}
