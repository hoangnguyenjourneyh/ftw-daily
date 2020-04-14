import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { ensureOwnListing } from '../../util/data';
import { ListingLink } from '..';
import { EditListingGeneralForm } from '../../forms';
import config from '../../config.js';

import css from './EditListingGeneralPanel.css';

const EditListingGeneralPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { title, description, publicData } = currentListing.attributes;
  const { subjects, levels, hours  } = publicData;
  const panelTitle = currentListing.id ? (
    <FormattedMessage
      id="EditListingGeneralPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingGeneralPanel.createListingTitle" />
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingGeneralForm
        className={css.form}
        initialValues={{ name: title, bio: description, subjects, levels, hours}}
        onSubmit={values => {
          const { name, bio, subjects, levels, hours } = values;
          const updateValues = {
            title: name,
            description: bio,
            publicData: {
              subjects,
              levels,
              hours,
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
        capacityOptions={config.custom.capacityOptions}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingGeneralPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingGeneralPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingGeneralPanel;