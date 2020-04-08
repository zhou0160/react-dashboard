import React from 'react';
import { Input, Icon , InputGroup } from 'rsuite';

const styles = {
    width: 250
};

function Search(props){

    return(
        <InputGroup inside style={styles}>
        <Input />
        <InputGroup.Button>
          <Icon icon="search"/>
        </InputGroup.Button>
      </InputGroup>
    )
}

export default Search;