import React from 'react';
// import fakeData from './fakeData';
import { Table, Checkbox, Icon, Modal, Button, Alert} from 'rsuite';

import ListFilter from './ListFilter';

class VisitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addColumn: false,
      displayLength: 10,
      loading: false,
      data: [],
      checkedKeys: [],
      show: false,
      filteredData: [],
      tableIsFiltered: false,
      searchInput: '',
      activeVisits: false,
      tokenKey:'tokenKey',
      isLoading:false,
      rowData: [],
      page:1,
      displayLength:10,
      sortColumn:'checkin',
      windowSize: "l",
      tableHeight: 500
    };
    this.handleSortColumn = this.handleSortColumn.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.close = this.close.bind(this);
  }

  getVisit = () => {
    const token = localStorage.getItem(this.state.tokenKey)

    const headers = new Headers();
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    headers.append('Accept', 'application/json');  
    headers.append('Origin','http://localhost:3000');
    headers.append('Access-Control-Allow-Credentials', 'true');

    headers.append('Authorization', `Token ${token}`);
    const url ='https://cors-anywhere.herokuapp.com/http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/visit'

    let req = new Request(url, {
        headers: headers,
        method: 'GET',
        mode: 'cors'
    });

    fetch(req)
    .then(res => res.json())
    .then(data => {

      const list = data.map(item => {

        let newItem = item

        newItem.visitorName = item.visitor.firstName + ' ' + item.visitor.lastName
        newItem.hostName = item.employee.firstName + ' ' + item.employee.lastName
        newItem.visitorEmail = item.visitor.email
        newItem.visitorPhone = item.visitor.phoneNumber

        newItem.checkin = item.checkin.replace('T', ' ').replace('Z','').split('.')[0]
        if(newItem.checkout){
          newItem.checkout = item.checkout.replace('T', ' ').replace('Z','').split('.')[0]
        }
        newItem.purpose = item.purpose.description

        return item
      });


      list.sort((a,b)=>{
        let x = parseInt(a.checkin.split('-').join('').split(' ').join('').split(':').join(''))
        let y = parseInt(b.checkin.split('-').join('').split(' ').join('').split(':').join(''))
        return y - x
      })


      this.setState({data: list})
      
    })
  }


  //CHECKOUT ACTION
  checkOut = () =>{
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

  checkOutVisits = () => {
    this.setState({isLoading:true})

    const { checkedKeys } = this.state;
    const token = localStorage.getItem(this.state.tokenKey)
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    headers.append('Accept', 'application/json');  
    headers.append('Origin','http://localhost:3000');
    headers.append('Access-Control-Allow-Credentials', 'true');

    headers.append('Authorization', `Token ${token}`);
    const url ='https://cors-anywhere.herokuapp.com/http://syntronic-visitorapp.eastus.cloudapp.azure.com:8000/api/v1/visit/bulkCheckout/'

    const now = new Date()

    const checkOutObj = {
      ids: checkedKeys,
      checkout: now.toISOString()
    }

    console.log(checkOutObj)

    let req = new Request(url, {
        headers: headers,
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(checkOutObj)
    });

    fetch(req)
    .then(res => res.json())
    .then(data => {
      if(data.message === "All visits updated successfully"){

        Alert.success('All the selected visits have been checked out successfull!')
        this.close()
        this.getVisit()
        this.props.getSummery()
      }
      this.setState({isLoading:false})
    })
    .catch(err=>{
      console.log(err)
      this.setState({isLoading:false})
    })
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
    this.setState({ filteredData: filteredData, tableIsFiltered: true, page:1 });
  };

  handleSetSearchInput = searchInput => {
    this.setState({ searchInput: searchInput });
  };

  handleChangePage = (dataKey) => {
    this.setState({
      page: dataKey
    });
  }
  handleChangeLength = (dataKey) => {
    this.setState({
      page: 1,
      displayLength: dataKey
    });
  }

//COLUMN SORTING LOGIC
  getData() {
    const { data, sortColumn, sortType, tableIsFiltered, filteredData  } = this.state;

    const displayData = tableIsFiltered ? filteredData : data

    if (sortColumn && sortType) {
      displayData.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (sortColumn === 'checkin' || sortColumn == 'checkout'){
          x = parseInt(x.split('-').join('').split(' ').join('').split(':').join(''))
          y = parseInt(y.split('-').join('').split(' ').join('').split(':').join(''))
        }else{
          if (typeof x === 'string') {
            x = x.charCodeAt();
          }
          if (typeof y === 'string') {
            y = y.charCodeAt();
          }
        }

        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }

    return this.getDataForChangePage(displayData);
  }

  getDataForChangePage = (data)=>{
    const { displayLength, page } = this.state;

    return data.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
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

  trackWindowSize = () =>{
    let windowWidth = window.innerWidth
    let size
    if(windowWidth < 600){
      size = 'xs'
    } else if (windowWidth < 800){
      size = 's'
    } else if (windowWidth < 1300){
      size = 'm'
    } else {
      size = "l"
    }
    let tableHeight = document.querySelector('.visitListTable').clientHeight
    this.setState({windowSize: size, tableHeight})
  }

  getTableHeight = () => {
    let tableHeight = document.querySelector('.visitListTable').clientHeight
    this.setState({tableHeight})
    console.log(tableHeight)
  }

  componentDidMount(){
    this.getVisit();
    this.getData();
    this.trackWindowSize()
    window.addEventListener('resize', this.trackWindowSize)
  }


  render() {

    const data = this.getData()
    const { Column, HeaderCell, Cell, Pagination } = Table;

    const { displayLength, checkedKeys, searchInput, filteredData, tableIsFiltered,rowData, page } = this.state;

    const dataToDisplay = tableIsFiltered || filteredData.length || searchInput.length ? filteredData : data;
    const dataForPageLength = tableIsFiltered || filteredData.length || searchInput.length ? dataToDisplay : this.state.data

    const guestOrGuests = checkedKeys.length === 1 ? 'guest' : 'guests'

    const modalDialog = `You are about to checkout ${checkedKeys.length} ${guestOrGuests}. 
        Would you like to proceed?`

    let checked = false;

    let indeterminate = false;

    const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
      <Cell {...props} style={{ padding: 0}} className="checkBoxes">
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
  <div id="visitList">

{/* LIST FILTER */}
  <ListFilter data={this.state.data}
              handleSetFilteredData={this.handleSetFilteredData}
              handleSetSearchInput={this.handleSetSearchInput} 
              getSummery={this.props.getSummery}
              tableIsFiltered={this.state.tableIsFiltered}
              getTableHeight = {this.getTableHeight}
              />
     
{/* VISITOR LIST TABLE  */}
      <Table
          height={this.state.tableHeight}
          rowHeight={58}
          data={data}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          onSortColumn={this.handleSortColumn}
          loading={this.state.loading}
          onRowClick={data => {
            console.log(data);
          }}
          className="visitListTable withFilterWindowClose"
        >
          <Column align="left" style={{ padding: 0 }} width={50} >
            <HeaderCell style={{ padding: 0}}>
              <div style={{ lineHeight: '40px'}}>
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

          <Column width={60}>
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

          {
            this.state.windowSize === 'l'?
            (<Column flexGrow={1} sortable>
              <HeaderCell>Company Name</HeaderCell>
              <Cell dataKey="company" />
            </Column>):
            ('')
          }
          
          <Column flexGrow={1} sortable>
              <HeaderCell>Checkin Time</HeaderCell>
              <Cell dataKey="checkin" />
            </Column>

          
          {
            this.state.windowSize === 'l' || this.state.windowSize === 'm' ?
            (<Column flexGrow={1} sortable>
              <HeaderCell>Checkout Time</HeaderCell>
              <Cell dataKey="checkout" />
            </Column>):
            ('')
          }
          

          {
            this.state.windowSize === 'l' || this.state.windowSize === 'm' ?
            (<Column flexGrow={1} sortable>
              <HeaderCell>Host</HeaderCell>
              <Cell dataKey="hostName" />
            </Column>):
            ('')
          }

          {
            this.state.windowSize === 'l'?
            (<Column flexGrow={1} sortable>
              <HeaderCell>Purpose</HeaderCell>
              <Cell dataKey="purpose" />
            </Column>):
            ('')
          }

          

      {/* INFO BUTTON ACTION */}

          <Column align="right" width={60}>
          <HeaderCell>Info</HeaderCell>
              <Cell>
                  {rowData => {
                    return (
                      <span>
                        <Icon icon='info' onClick={() => {
                          this.open(rowData)
                          console.log(`id:${rowData.id}`);
                          }}  className="infoIcon" alt="info"/>
                      </span>
                    );
                  }}
                </Cell>
          </Column>
        </Table>


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

        {/* Pagination */}

        <Pagination
          lengthMenu={[
            {
              value: 10,
              label: 10
            },
            {
              value: 20,
              label: 20
            }
          ]}
          activePage={page}
          displayLength={displayLength}
          total={dataForPageLength.length}
          onChangePage={this.handleChangePage}
          onChangeLength={this.handleChangeLength}
        />


      {/* CHECKOUT BUTTON */}
          <div className="checkOutActions">
              <button disabled={checkedKeys.length === 0?true:false}
              className={checkedKeys.length === 0 ? 'checkOutButton' : 'checkOutButtonActive'} 
              onClick={this.checkOut}
              >Checkout</button>
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
                    <Button className="cancelModalBtn" onClick={this.close} appearance="subtle">
                    Cancel
                    </Button>
                    <Button className="yesModalBtn" onClick={this.checkOutVisits} appearance="primary">
                    Yes, proceed
                    {this.state.isLoading? <span>&nbsp;<Icon icon="spinner" pulse /></span> : ''}
                    </Button>
                </div> 
            </Modal.Footer>
            </Modal>
        </div>
       </div> 
    );
  }
}

export default VisitList;
