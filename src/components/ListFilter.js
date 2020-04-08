
import React from 'react';
import { Accordion } from 'react-bootstrap';
import { Icon, Input, InputGroup } from 'rsuite';
import CollapsedFilter from './CollapsedFilter'

const data = [{
  value: '' ,// property value is the value of valueKey 
  label: 'All' 
},
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
  value: 'Conference' ,// property value is the value of valueKey 
  label: 'Conference' 
},
]
export default class ListFilter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filteredData: [],
        searchInput: "",
        options: data,
        selectedValue: [],
        activeVisitsOnly: false,
        inactiveVisitsOnly: false,
        time:[]
      };
      this.handlePurposeChange = this.handlePurposeChange.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }


    //Handle Purpose Filter Change
    handlePurposeChange(value){ //this value is an array now.
      console.log('Purpose:', value)
        this.setState({ selectedValue: value });
    };

    //Handles Active Visits Change 
    handleToggleChange = (value) => {
        this.setState({
           activeVisitsOnly : !this.state.activeVisitsOnly });
    };

    //Handles Completed Toggle Change 
    handleCompletedToggleChange = (value) => {
            this.setState({
               inactiveVisitsOnly : !this.state.inactiveVisitsOnly });
    };

    //Handles Time Change 
    handleTimeChange = (value) => {
      console.log('Time: ', value) // this value is an array of date object. from [0] to [1]
      this.setState({time: value})
    }
    
    //Handles Input Change 
    handleChange = event => {
        const val = event.target.value;
        this.setState({ searchInput: val }, () => this.searchTable());
        this.props.handleSetSearchInput(val);
    };

    //Search by Visitor Name, Company or Host
    //Filters orginal data if no filters are applied, filters filtered data when filters apply
    searchTable = () => {

        const { searchInput, filteredData } = this.state;

        let newFilteredData;

        if(this.props.tableIsFiltered){
         newFilteredData = filteredData.filter(value => {
            return (
            value.visitor.firstName.toLowerCase().includes(searchInput.toLowerCase())  ||
            value.visitor.lastName.toLowerCase().includes(searchInput.toLowerCase())  ||
            value.employee.firstName.toLowerCase().includes(searchInput.toLowerCase())  ||
            value.company.toLowerCase().includes(searchInput.toLowerCase()) 
            )
        });
      }else{
        newFilteredData = this.props.data.filter(value => {
          return (
          value.visitor.firstName.toLowerCase().includes(searchInput.toLowerCase())  ||
          value.visitor.lastName.toLowerCase().includes(searchInput.toLowerCase())  ||
          value.employee.firstName.toLowerCase().includes(searchInput.toLowerCase())  ||
          value.company.toLowerCase().includes(searchInput.toLowerCase()) 
          )
      });
      }

      console.log(newFilteredData)
        this.props.handleSetFilteredData(newFilteredData);
        console.log(!searchInput)
        if(!searchInput){
          this.setState({filteredData: this.props.data})
          this.props.handleSetFilteredData(this.props.data);

        }
      }; 


      applyFilters = () =>{
        const purpose = this.state.selectedValue

        let filteredData = this.state.searchInput? this.state.filteredData : this.props.data

        if(purpose.length !== 0){ // filter purpose
          filteredData = filteredData.filter(value => {
            if(purpose.findIndex((item)=>item == value.purpose) !== -1){
              return true
            } else {
              return false
            }
          })
        }

        filteredData = filteredData.filter(value => { //filter status
          if(this.state.activeVisitsOnly){
            if(value.checkout ==null){
              return true
            } else {
              return false
            }
          } else if(this.state.inactiveVisitsOnly){
            if(value.checkout != null){
              return true
            } else{
              return false
            }
          } else {
            return true
          }
        })

        if(this.state.time.length !== 0){

          let from = parseInt(this.state.time[0].toISOString().split('T')[0].split('-').join(''))
          let to = parseInt(this.state.time[1].toISOString().split('T')[0].split('-').join(''))


          filteredData = filteredData.filter(value => {
            let date = parseInt(value.checkin.split(' ')[0].split('-').join(''))
            if(from <= date && date <= to){
              return true
            } else {
              return false
            }
          })
        }

        this.setState({ filteredData: filteredData })
        this.props.handleSetFilteredData(filteredData)
        this.props.getSummery(this.state.time[0]?.toISOString(),this.state.time[1]?.toISOString())
      }

      changeTableHeight = () => {
        if(document.querySelector('.collapse.show')){
          document.querySelector('.visitListTable').classList.add('withFilterWindowClose')
         }else{
          document.querySelector('.visitListTable').classList.remove('withFilterWindowClose')
         }
         setTimeout(()=>this.props.getTableHeight(), 600)
      }

    render() {
        const { options, selectedValue, searchInput, inactiveVisitsOnly, activeVisitsOnly } = this.state
        return(
            <Accordion>
              <div className="ListFilter">
                <div className="filterHeader">
                  <Accordion.Toggle eventKey="0" className="filterButton" as="button" onClick={this.changeTableHeight}>
                    Filter<Icon style={{padding:2}} icon='sliders' alt="silders"/>
                  </Accordion.Toggle>

                  <InputGroup inside style={{width:250}}>
                    <Input value={searchInput || ""}
                      onChange={(value, event)=>{
                        this.handleChange(event)}}/>
                    <InputGroup.Button>
                      <Icon icon="search"/>
                    </InputGroup.Button>
                  </InputGroup>
                </div>
                <Accordion.Collapse eventKey="0">
                  <CollapsedFilter changeTableHeight={this.changeTableHeight} handleTimeChange={this.handleTimeChange} handlePurposeChange={this.handlePurposeChange} inactiveVisitsOnly={inactiveVisitsOnly} activeVisitsOnly={activeVisitsOnly} handleToggleChange={this.handleToggleChange} handleCompletedToggleChange={this.handleCompletedToggleChange} applyFilters={this.applyFilters}/>
                </Accordion.Collapse>

              </div>
            </Accordion> 
            );
        }
        }
