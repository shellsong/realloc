import React, {Component, PropTypes} from 'react'
const ENTER_KEY_CODE = 13;
export default class TodoTextInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    defaultValue: PropTypes.string
  }
  static defaultProps = {
    id:'',
    className:'',
    placeholder:'',
    defaultValue:''
  }
  constructor(props, context){
    super(props)
    this.state = {
      value: props.defaultValue
    }
    this._save = this._save.bind(this)
    this._onChange = this._onChange.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
  }
  _save(){
    this.props.onSave(this.state.value);
    this.setState({
      value: ''
    })
  }
  _onChange(event) {
    this.setState({
      value: event.target.value
    })
  }
  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save()
    }
  }
  render(){
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    )
  }
}
