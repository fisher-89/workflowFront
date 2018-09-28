import React from 'react';
import classNames from 'classnames';
import style from './index.less';

class Tag extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      onEditing: false,
      inputValue: value,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    const oldValue = this.props.value;
    if (value !== oldValue) {
      this.setState({
        inputValue: value,
      });
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    const { onChange, index } = this.props;
    this.setState({
      inputValue: value,
    });
    onChange(value, index);
  }

  handleInputBlur = (e) => {
    const { value } = e.target;
    const { handleClose } = this.props;
    this.setState({
      onEditing: false,
    }, () => {
      if (!value) {
        handleClose(value);
      }
    });
  }

  showInput = () => {
    this.setState({
      onEditing: true,
    }, () => this.textInput.focus());
  }

  render() {
    const { onEditing, inputValue } = this.state;
    const { handleClose, readonly } = this.props;
    const cls = classNames(style.item, {
      [style.readonly]: readonly,
    });
    return (
      <div
        className={style.tag_item}
      >
        <div
          className={style.item}
          style={(!onEditing ? { display: 'none' } : null)}
        >
          <input
            value={`${inputValue || ''}`}
            ref={(e) => { this.textInput = e; }}
            // style={{ width: '180px' }}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
          />
        </div>
        {!onEditing && (
          <div className={cls}>
            <p onClick={!readonly ? this.showInput : null}>{inputValue}</p>
            {!readonly && <span onClick={() => handleClose(inputValue)} />}
          </div>
          )}
      </div>
    );
  }
}

export default Tag;
