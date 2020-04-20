import React from 'react';
import { string } from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { FieldRadioButton, ValidationError } from '..';

const FieldRadioButtonRenderer = props => {
  const { label, options, fields, className, meta, id } = props;
  return (
    <div className={className}>
      <label>{label}</label>
      {options && options.map( item => (
        <FieldRadioButton
          key={`${id}.${item.key}`}
          id={`${id}.${item.key}`}
          name={fields.name}
          label={item.label}
          value={item.key}
        />
      ))}
      <ValidationError fieldMeta={{ ...meta }} />
    </div>
  );  
}

const FieldRadioButtonGroup = props => <FieldArray component={FieldRadioButtonRenderer} {...props} />;

FieldRadioButtonGroup.propTypes = {
  name: string.isRequired,
};
export default FieldRadioButtonGroup;
