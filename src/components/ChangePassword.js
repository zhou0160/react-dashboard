import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Modal, Button } from 'rsuite';
import { Icon } from 'rsuite';


function ChangePassword(props) {
 
      return (
        <div>
          <Modal show={props.isChangePassword} onHide={props.hideChangePassword} size="xs">
            <Modal.Header>
              <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                fluid
                onChange={props.handleChangePasswordInput}
              >
                <FormGroup>
                  <ControlLabel>Old Password*</ControlLabel>
                  <FormControl name="currentPassword" type="password"/>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>New Password*</ControlLabel>
                  <FormControl name="newPassword" type="password" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Confirm New Password*</ControlLabel>
                  <FormControl name="reTypePassword" type="password" />
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={props.hideChangePassword} appearance="subtle">
                Cancel
              </Button>
              <Button onClick={props.changePassword} appearance="primary">
                Confirm
                {props.isLoading? <span>&nbsp;<Icon icon="spinner" pulse /></span> : ''}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
}

export default ChangePassword