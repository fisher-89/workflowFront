import React from 'react';
import { Toast } from 'antd-mobile';
import Tag from './tag.js';
import { isJSON } from '../../../utils/util';
import style from './index.less';

export default class TagGroup extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    let newValue = [];
    if (typeof value === 'object' && value) {
      newValue = value;
    } else {
      newValue = isJSON(value) || [];
    }
    this.state = {
      onEditing: false,
      inputValue: '',
      tags: newValue,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    const oldValue = this.props.value;
    if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
      const tags = value;
      this.setState({
        tags,
      });
    }
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      inputValue: value,
    });
  }

  handleInputBlur = () => {
    const { inputValue, tags } = this.state;
    const { onChange } = this.props;
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    this.setState({
      onEditing: false,
      tags: newTags,
      inputValue: '',
    });
    onChange(newTags);
  }

  handleClose = (removedTag) => {
    const { range: { min } } = this.props;
    const { tags } = this.state;
    if (min && `${min}` >= `${tags.length}`) {
      Toast.info(`请至少添加${min}个`, 1);
    }
    const newTags = tags.filter(tag => `${tag}` !== `${removedTag}`);
    this.setState({ tags: newTags });
  }

  editTagValue = (value, index) => {
    const { tags } = this.state;
    tags.splice(index, 1, value);
    this.setState({
      tags,
    });
  }

  showInput = () => {
    this.setState({
      onEditing: true,
    }, () => this.textInput.focus());
  }

  makeTagProps = (value, index) => {
    const { readonly, range } = this.props;
    const props = {
      value,
      key: index,
      index,
      readonly,
      range,
      handleClose: this.handleClose,
      onChange: this.editTagValue,
    };
    return props;
  }

  renderTag = () => {
    const { tags } = this.state;
    return tags.map((item, i) => {
      const props = this.makeTagProps(item, i);
      return (
        <Tag
          {...props}
        />
      );
    });
  }
  render() {
    const { onEditing, inputValue, tags } = this.state;
    const { readonly, range: { max } } = this.props;
    return (
      <div className={style.contain}>
        {this.renderTag()}
        {!readonly && `${tags.length}` < `${max}` && (
        <div
          className={style.item}
          style={{ border: '1px dashed #c7c7c7' }}
        >
          {onEditing && (
          <input
            value={inputValue}
            ref={(e) => { this.textInput = e; }}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
          />
        )}
          {!onEditing && <p onClick={this.showInput}>+添加</p>}
        </div>
        )}
      </div>
    );
  }
}

TagGroup.defaultProps = {
  readonly: true,
  range: { min: 1, max: 10 },
};
