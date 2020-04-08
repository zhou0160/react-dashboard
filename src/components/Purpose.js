import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';

const data = [
{
  value: 'Meeting' ,// property value is the value of valueKey 
  label: 'Meeting' 
},{
  value: 'Interview' ,// property value is the value of valueKey 
  label: 'Interview' 
},{
  value: 'Event' ,// property value is the value of valueKey 
  label: 'Event' 
},{
  value: 'Other' ,// property value is the value of valueKey 
  label: 'Other' 
},
]


export default class Purpose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: []
    };
  }

  handlePurposeChange = (value) => {
    this.setState({ selectedValue: value });
    this.props.handlePurposeChange(value)
  };

  render() {
    const checkboxList = data.map(item => <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>)
    return(
      <CheckboxGroup inline name="purposeList" onChange={this.handlePurposeChange} value={this.state.value}>
        {checkboxList}
      </CheckboxGroup>
      )
  }
}
