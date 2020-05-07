import React, { Component } from 'react';
import { string, bool, arrayOf } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, Field } from 'react-final-form';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import moment from 'moment';
import { bookingStartTimeAtLeast, bookingEndTimeAtLeast } from '../../util/validators';
import { START_DATE, END_DATE, AT_LEAST_HOURS, timestampToDate } from '../../util/dates';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Form, PrimaryButton, FieldDateTimeRangeInput, ValidationError } from '../../components';
import EstimatedBreakdownMaybe from '../BookingDatesForm/EstimatedBreakdownMaybe';

import css from '../BookingDatesForm/BookingDatesForm.css';
import { LINE_ITEM_DAY } from '../../util/types';

const identity = v => v && v.date ? { date: v.date } : v;

export class BookingDateTimeFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  endTimeToApiDate = (endTime) => {
    const { unitType } = this.props;
    return unitType === LINE_ITEM_DAY ?
      moment(Number.parseInt(endTime, 10)).add(1, 'days').toDate() :
      moment(Number.parseInt(endTime, 10)).toDate();
  }

  // In case start or end date for the booking is missing
  // focus on that input, otherwise continue with the
  // default handleSubmit function.
  handleFormSubmit(e) {
    const { bookingStartTime, bookingEndTime: endTime } = e || {};

    const bookingEndTime = this.endTimeToApiDate(endTime);
    const result = {
      bookingDates: {
        startDate: bookingStartTime ? timestampToDate(bookingStartTime) : null,
        endDate: bookingEndTime,
      }
    }

    if (!bookingStartTime) {
      this.setState({ focusedInput: START_DATE });
    } else if (!bookingEndTime) {
      this.setState({ focusedInput: END_DATE });
    } else {
      this.props.onSubmit(result);
    }
  }

  render() {
    
    const { rootClassName, className, price: unitPrice, intl, ...rest } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    const endDateErrorMessage = intl.formatMessage({
      id: 'FieldDateRangeInput.invalidEndDate',
    });
    if (!unitPrice) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingPriceMissing" />
          </p>
        </div>
      );
    }
    if (unitPrice.currency !== config.currency) {
      return (
        <div className={classes}>
          <p className={css.error}>
            <FormattedMessage id="BookingDatesForm.listingCurrencyInvalid" />
          </p>
        </div>
      );
    }

    return (
      <FinalForm
        {...rest}
        intl={intl}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        validate={bookingEndTimeAtLeast(endDateErrorMessage)}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            formId,
            handleSubmit,
            intl,
            isOwnListing,
            submitButtonWrapperClassName,
            unitPrice,
            unitType,
            values,
            timeSlots,
            fetchTimeSlotsError,
            form,
          } = fieldRenderProps;
          const { bookingStartDate, bookingEndTime } = values ? values : {};
          const startDate = bookingStartDate && bookingStartDate.date;
          const endDate = bookingEndTime && this.endTimeToApiDate(bookingEndTime);

          const bookingStartDateLabel = intl.formatMessage({ id: 'BookingDateTimeForm.bookingStartDateTitle' });
          const bookingStartTimeLabel = intl.formatMessage({ id: 'BookingDateTimeForm.bookingStartTimeTitle' });
          const bookingEndDateLabel = intl.formatMessage({ id: 'BookingDateTimeForm.bookingEndDateTitle' });
          const bookingEndTimeLabel = intl.formatMessage({ id: 'BookingDateTimeForm.bookingEndTimeTitle' });
          const bookingStartTimeAtLeastMessage = intl.formatMessage({ id: 'BookingDateTimeForm.requireBeforeStartTime12hrs' });
          
          const timeSlotsError = fetchTimeSlotsError ? (
            <p className={css.timeSlotsError}>
              <FormattedMessage id="BookingDatesForm.timeSlotsError" />
            </p>
          ) : null;

          // This is the place to collect breakdown estimation data. See the
          // EstimatedBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const bookingData =
            startDate && endDate
              ? {
                  unitType,
                  unitPrice,
                  startDate,
                  endDate,
                  // NOTE: If unitType is `line-item/units`, a new picker
                  // for the quantity should be added to the form.
                  quantity: 1,
                }
              : null;
          const bookingInfo = bookingData ? (
            <div className={css.priceBreakdownContainer}>
              <h3 className={css.priceBreakdownTitle}>
                <FormattedMessage id="BookingDatesForm.priceBreakdownTitle" />
              </h3>
              <EstimatedBreakdownMaybe bookingData={bookingData} />
            </div>
          ) : null;

          const dateFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          };

          const now = moment();
          const today = now.startOf('day').toDate();
          const tomorrow = now
            .startOf('day')
            .add(1, 'days')
            .toDate();
          const startDatePlaceholderText =
            startDatePlaceholder || intl.formatDate(today, dateFormatOptions);
          const endDatePlaceholderText =
            endDatePlaceholder || intl.formatDate(tomorrow, dateFormatOptions);
          const submitButtonClasses = classNames(
            submitButtonWrapperClassName || css.submitButtonWrapper
          );

          return (
            <Form onSubmit={handleSubmit} className={classes}>
                <Field name='bookingStartTime'  validate={bookingStartTimeAtLeast(bookingStartTimeAtLeastMessage, AT_LEAST_HOURS)}>
                {({ input, meta }) => (
                  <div>
                    {timeSlotsError}
                    <ValidationError fieldMeta={meta} />
                    <FieldDateTimeRangeInput
                      className={css.bookingDates}
                      unitType={unitType}
                      startDateLabel={bookingStartDateLabel}
                      startTimeLabel={bookingStartTimeLabel}
                      startDatePlaceholderText={startDatePlaceholderText}
                      endDateLabel={bookingEndDateLabel}
                      endTimeLabel={bookingEndTimeLabel}
                      endDatePlaceholderText={endDatePlaceholderText}
                      fromId={formId}
                      focusedInput={this.state.focusedInput}
                      format={identity}
                      values={values}
                      timeSlots={timeSlots}
                      intl={intl}
                      form={form}
                    />
                    {bookingInfo}
                    <p className={css.smallPrint}>
                      <FormattedMessage
                        id={
                          isOwnListing
                            ? 'BookingDatesForm.ownListing'
                            : 'BookingDatesForm.youWontBeChargedInfo'
                        }
                      />
                    </p>
                    <div className={submitButtonClasses}>
                      <PrimaryButton type="submit">
                        <FormattedMessage id="BookingDatesForm.requestToBook" />
                      </PrimaryButton>
                    </div>
                  </div>
                )}
                </Field>              
            </Form>
          );
        }}
      />
    );
  }
}

BookingDateTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  submitButtonWrapperClassName: null,
  price: null,
  isOwnListing: false,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  timeSlots: null,
};

BookingDateTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  submitButtonWrapperClassName: string,

  unitType: propTypes.bookingUnitType.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  timeSlots: arrayOf(propTypes.timeSlot),

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,
};

const BookingDateTimeForm = compose(injectIntl)(BookingDateTimeFormComponent);
BookingDateTimeForm.displayName = 'BookingDateTimeForm';

export default BookingDateTimeForm;
