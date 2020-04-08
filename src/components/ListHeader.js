import React from 'react';
import { Grid, Row, Col } from 'rsuite';


function ListHeader(props){

    return(
        <Grid fluid className="list">
            <Row className="show-grid">
                <Col xs={1}></Col>
                <Col xs={1}></Col>
                <Col xs={4}>Visitor</Col>
                <Col xs={3}>Company</Col>
                <Col xs={4}>Check-in Time</Col>
                <Col xs={4}>Chech-out Time</Col>
                <Col xs={3}>Host</Col>
                <Col xs={2}>Purpose</Col>
                <Col xs={1}>Status</Col>
                <Col xs={1}></Col>
            </Row>
        </Grid>
    )
}

export default ListHeader;
