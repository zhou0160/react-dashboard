import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default function Checkboxes() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <div className="checkBoxStatus">
      <Checkbox
        checked={checked}
        onChange={handleChange}
        value="secondary"
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <p>Not Check-out Only</p>
    </div>
  );
}