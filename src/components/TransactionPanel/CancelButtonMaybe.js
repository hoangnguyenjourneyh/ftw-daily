import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { SecondaryButton } from '..';

import css from './TransactionPanel.css';

// Functional component as a helper to build ActionButtons for
// provider when state is preauthorized
const CancelButtonMaybe = props => {
  const {
    className,
    rootClassName,
    showButtons,
    cancelInProgress,
    cancelError,
    onCancel,
  } = props;

  const buttonsDisabled = cancelInProgress;

  const cancelErrorMessage = cancelError ? (
    <p className={css.actionError}>
      <FormattedMessage id="TransactionPanel.cancelFailed" />
    </p>
  ) : null;

  const classes = classNames(rootClassName || css.actionButtons, className);

  return showButtons ? (
    <div className={classes}>
      <div className={css.actionErrors}>
        {cancelErrorMessage}
      </div>
      <div className={css.actionButtonWrapper}>
        <SecondaryButton
          inProgress={cancelInProgress}
          disabled={buttonsDisabled}
          onClick={onCancel}
        >
          <FormattedMessage id="TransactionPanel.cancelButton" />
        </SecondaryButton>
      </div>
    </div>
  ) : null;
};

export default CancelButtonMaybe;
