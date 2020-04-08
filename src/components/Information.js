import React from 'react';
import fakeData from './fakeData';
import { Table, Checkbox, Icon, Modal } from 'rsuite';
import ListFilter from './ListFilter';

class VisitList extends React.Component {
constructor(props) {
    super(props);
    const data = fakeData.map(item=>{
      let newItem = item
      newItem.visitorName = item.visitor.firstName + ' ' + item.visitor.lastName
      newItem.hostName = item.employee.firstName + ' ' + item.employee.lastName
      newItem.visitorEmail = item.visitor.email
      newItem.visitorPhone = item.visitor.phoneNumber
      newItem.checkin = item.checkin.replace('T', ' ').replace('Z','')
      if(newItem.checkout){
        newItem.checkout = item.checkout.replace('T', ' ').replace('Z','')
      }
      return item
    });
    this.state = {
      addColumn: false,
      displayLength: 10,
      loading: false,
      data: data,
      checkedKeys: [],
      show: false,
      filteredData: [],
      tableIsFiltered: false,
      searchInput: '',
      activeVisits: false,
      showInfo: false,
      rowData: [],
    };
    this.handleSortColumn = this.handleSortColumn.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

//CHECKOUT ACTION
  checkOut(){
    const { checkedKeys } = this.state;
    console.log(`checkedout ${checkedKeys}`);
    this.setState({ show: true });
  }

  close() {
    this.setState({ show: false, showInfo: false });
  }


  open(rowData) {
    this.setState({ showInfo: true, rowData: rowData });
    console.log(rowData)
  }

//HANDLES CHECKALL 

  handleCheckAll(value, checked) {
    const { data } = this.state;
    const checkedKeys = checked ? data.map(item => item.id) : [];
    this.setState({
      checkedKeys
    })
  }

  //HANDLE SINGLE CHECK

  handleCheck(value, checked) {
    const { checkedKeys } = this.state;
    const nextCheckedKeys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter(item => item !== value);

    this.setState({
      checkedKeys: nextCheckedKeys
    });
  }

  handleSetData = data => {
    console.log(data);
    this.setState({ data });
  };



  handleSetFilteredData = filteredData => {
    this.setState({ filteredData: filteredData, tableIsFiltered: true });
  };

  handleSetSearchInput = searchInput => {
    this.setState({ searchInput });
  };

//COLUMN SORTING LOGIC
  getData() {
    const { data, sortColumn, sortType } = this.state;

    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt();
        }
        if (typeof y === 'string') {
          y = y.charCodeAt();
        }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  }

  handleSortColumn(sortColumn, sortType) {
    this.setState({
      loading: true
    });

    setTimeout(() => {
      this.setState({
        sortColumn,
        sortType,
        loading: false
      });
    }, 500);
    this.getData()
  }


  render() {
    const { Column, HeaderCell, Cell } = Table;
    const { data, checkedKeys, searchInput, filteredData, tableIsFiltered, rowData } = this.state;
    const dataToDisplay = tableIsFiltered || filteredData.length || searchInput.length ? filteredData : data;
    const guestOrGuests = checkedKeys.length === 1 ? 'guest' : 'guests'
    const modalDialog = `You are about to checkout ${checkedKeys.length} ${guestOrGuests}. 
        Would you like to proceed?`   
    let checked = false;
    let indeterminate = false;
    const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
      <Cell {...props} style={{ padding: 0 }}>
        <div style={{ lineHeight: '46px' }}>
          <Checkbox
            value={rowData[dataKey]}
            inline
            onChange={onChange}
            checked={checkedKeys.some(item => item === rowData[dataKey])}
          />
        </div>
      </Cell>
    );
   if (checkedKeys.length === data.length) {
      checked = true;
    } else if (checkedKeys.length === 0) {
      checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
      indeterminate = true;
    }
    
  return (
  <div>

{/* LIST FILTER */}
  <ListFilter data={this.state.data}
              handleSetFilteredData={this.handleSetFilteredData}
              handleSetSearchInput={this.handleSetSearchInput} />
     
{/* VISITOR LIST TABLE  */}
      <Table
         height={700}
         rowHeight={58}
          data={dataToDisplay}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          onSortColumn={this.handleSortColumn}
          loading={this.state.loading}
          onRowClick={data => {
            console.log(data);
          }}
          className="visitListTable"
        >
          <Column align="center" >
            <HeaderCell style={{ padding: 0 }}>
              <div style={{ lineHeight: '40px' }}>
                <Checkbox
                  inline
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={this.handleCheckAll}
                />
              </div>
            </HeaderCell>
            <CheckCell
              dataKey="id"
              checkedKeys={checkedKeys}
              onChange={this.handleCheck}
            />
          </Column>

          <Column>
            <HeaderCell></HeaderCell>
            <Cell>
            {(rowData, rowIndex) => {
            return <div className="nameCircle">
            <div className="nameLetter">{`${rowData.visitor.firstName.charAt(0)}`}</div>
            </div>;
                }}
            </Cell>
          </Column>

          <Column flexGrow={1} sortable colSpan={2}>
            <HeaderCell>Visitor</HeaderCell>
            <Cell dataKey="visitorName" />
          </Column>

          <Column flexGrow={1} sortable>
            <HeaderCell>Company Name</HeaderCell>
            <Cell dataKey="company" />
          </Column>

          <Column flexGrow={1} sortable>
            <HeaderCell>Checkin Time</HeaderCell>
            <Cell dataKey="checkin" />
          </Column>

          <Column flexGrow={1} sortable>
            <HeaderCell>Checkout Time</HeaderCell>
            <Cell dataKey="checkout" />
          </Column>

          <Column flexGrow={1} sortable>
            <HeaderCell>Host</HeaderCell>
            <Cell dataKey="hostName" />
          </Column>

          <Column flexGrow={1} sortable>
            <HeaderCell>Purpose</HeaderCell>
            <Cell dataKey="purpose" />
          </Column>

      {/* INFO BUTTON ACTION */}
          <Column flexGrow={1}>
          <HeaderCell></HeaderCell>
              <Cell>
                  {rowData => {
                    function handleInfo() {
                      console.log(`id:${rowData.id}`);
                    }
                    return (
                      <span>
                        <Icon icon='info' o onClick={() => this.open(rowData)} alt="info"/>
                      </span>
                    );
                  }}
                </Cell>
          </Column>
        </Table>

      {/* CHECKOUT BUTTON */}
          <div className="checkOutActions">
              <button disabled={checkedKeys.length === 0?true:false}
              className={checkedKeys.length === 0 ? 'checkOutButton' : 'checkOutButtonActive'} 
              onClick={this.checkOut.bind(this)}>Checkout</button>
          </div>   

       {/* INFO MODAL */}
      <div className="modal-container">
            <Modal show={this.state.showInfo} onHide={this.close}>
            <Modal.Header>
                <Modal.Title>Visit Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="infoText">
              <div> <span style={{fontWeight: "bold"}}>Visitor:</span> {rowData.visitorName}</div>
              <div> <span style={{fontWeight: "bold"}}> Company:</span> {rowData.company}</div>
              <div> <span style={{fontWeight: "bold"}}>Email:</span> {rowData.visitorEmail}</div>
              <div><span style={{fontWeight: "bold"}}>Phone:</span> {rowData.visitorPhone}</div>
              <br/>
              <div><span style={{fontWeight: "bold"}}>Host:</span> {rowData.hostName}</div>
              <div><span style={{fontWeight: "bold"}}> Purpose:</span> {rowData.purpose}</div>
              <br/>
              <div><span style={{fontWeight: "bold"}}> Check-in time:</span> {rowData.checkin}</div>
              <div><span style={{fontWeight: "bold"}}> Check-out time:</span> {rowData.checkout}</div>     
            </div>   
            </Modal.Body>
            <Modal.Footer>
                <div className="modalBtnActions"> 
                    <button className="yesModalBtn" onClick={this.close} appearance="primary">
                    Ok
                    </button>
                </div> 
            </Modal.Footer>
            </Modal>
        </div>

      {/* CHECKOUT MODAL */}
      <div className="modal-container">
            <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header>
                <Modal.Title>Check-out Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalDialog}
            </Modal.Body>
            <Modal.Footer>
                <div className="modalBtnActions"> 
                    <button className="cancelModalBtn" onClick={this.close} appearance="subtle">
                    Cancel
                    </button>
                    <button className="yesModalBtn" onClick={this.close} appearance="primary">
                    Yes, proceed.
                    </button>
                </div> 
            </Modal.Footer>
            </Modal>
        </div>
       </div> 
    );
  }
}

export default VisitList;
