import React from 'react';
import { bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, Button, FieldTextInput, FieldCheckboxGroup, FieldRadioButton } from '../../components';
import { required, maxLength, composeValidators } from '../../util/validators';

import css from './EditListingGeneralForm.css';

const TITLE_MAX_LENGTH = 60;

export const EditListingGeneralFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={fieldRenderProps => {
      const {
        className,
        disabled,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateError,
        updateInProgress,
      } = fieldRenderProps;

      const nameMessage = intl.formatMessage({ id: 'EditListingGeneralForm.name' });
      const namePlaceholderMessage = intl.formatMessage({ id: 'EditListingGeneralForm.namePlaceholder' });

      const bioMessage = intl.formatMessage({ id: 'EditListingGeneralForm.bio' });
      const bioPlaceholderMessage = intl.formatMessage({ id: 'EditListingGeneralForm.bioPlaceholder' });

      const subjectMessage = intl.formatMessage({ id: 'EditListingGeneralForm.subject' });
      const levelMessage = intl.formatMessage({ id: 'EditListingGeneralForm.level' });
      const hourMessage = intl.formatMessage({ id: 'EditListingGeneralForm.hour' });

      const nameRequiredMessage = intl.formatMessage({ id: 'EditListingGeneralForm.nameRequired' });
      const bioRequiredMessage = intl.formatMessage({ id: 'EditListingGeneralForm.bioRequired' });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingGeneralForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const errorMessage = updateError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingGeneralForm.updateFailed" />
        </p>
      ) : null;

      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);

      const classes = classNames(css.root, className);
      const submitReady = updated && pristine;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}

          <FieldTextInput
            id="name"
            name="name"
            className={css.name}
            type="text"
            label={nameMessage}
            placeholder={namePlaceholderMessage}         
            validate={composeValidators(required(nameRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="bio"
            name="bio"
            className={css.bio}
            type="textarea"
            label={bioMessage}
            placeholder={bioPlaceholderMessage}
            validate={composeValidators(required(bioRequiredMessage))}
          />

          <FieldCheckboxGroup
            className={css.subjects}
            label={subjectMessage}
            id="subjects"
            name="subjects"
            options={config.custom.subjects}
          />

          <FieldCheckboxGroup
            className={css.levels}
            label={levelMessage}
            id="levels"
            name="levels"
            options={config.custom.levels}
          />
          <div>
            <label> {hourMessage} </label>
            {config.custom && config.custom.teachingHours.map( item => (
              <FieldRadioButton
                key={item.key}
                id={item.key}
                name="teachingHours"
                label={item.label}
                value={item.key}
              />
            ))}
          </div>
          
          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingGeneralFormComponent.defaultProps = {
  selectedPlace: null,
  updateError: null,
};

EditListingGeneralFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
};

export default compose(injectIntl)(EditListingGeneralFormComponent);