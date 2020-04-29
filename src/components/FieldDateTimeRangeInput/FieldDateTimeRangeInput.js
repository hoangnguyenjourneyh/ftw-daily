/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */

import React, { Component } from 'react';
import { func, string, arrayOf } from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { START_DATE, END_DATE, localizeAndFormatTime, getStartHours, resetToStartOfDay, dateIsAfter, AT_LEAST_HOURS } from '../../util/dates';
import { bookingDateRequired, bookingStartTimeAtLeast, required} from '../../util/validators';
import { propTypes } from '../../util/types';
import { intlShape } from '../../util/reactIntl';
import { FieldDateInput, FieldSelect } from '..';
import css from './FieldDateTimeRangeInput.css';

const TODAY = new Date();

const getAvailableHours = (intl, bookingStartDate) => {
  const bookingStartDateReset = resetToStartOfDay(bookingStartDate);
  return getStartHours(intl, bookingStartDateReset, moment(bookingStartDate).hours(24).toDate());
}

class FieldDateTimeRangeInput extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: false };
  }
  componentDidUpdate(prevProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (this.props.focusedInput && this.props.focusedInput !== prevProps.focusedInput) {
      this.setState({ focusedInput: this.props.focusedInput });
    }
  }

  onBookingStartDateChange = value => {
    const { form } = this.props;
      form.batch(() => {
        form.change('bookingStartTime', value.date.getTime());
        form.change('bookingEndTime', value.date.getTime());
        form.change('bookingEndDate', { date: value.date });
    });
  };

  onBookingStartTimeChange = event => {
    const { form } = this.props;
    form.change('bookingStartTime', event.target.value);
  }

  onBookingEndDateChange = value => {
    const { form } = this.props;
    form.change('bookingEndTime', value.date.getTime());
  }

  onBookingEndTimeChange = event => {
    const { form } = this.props;
    form.change('bookingEndTime', event.target.value);
  }

  isOutsideRange = (day, bookingStartDate) => {
    const startDate = resetToStartOfDay(bookingStartDate);
    return !(dateIsAfter(day, startDate));
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      startDateLabel,
      startTimeLabel,
      endDateLabel,
      endTimeLabel,
      // Extract focusedInput and onFocusedInputChange so that
      // the same values will not be passed on to subcomponents.
      focusedInput,
      startDatePlaceholderText,
      endDatePlaceholderText,
      formId,
      values,
      intl,
      format,
    } = this.props;

    const bookingStartDate =
      values.bookingStartDate && values.bookingStartDate.date ? values.bookingStartDate.date : null;
    const bookingEndDate =
      values.bookingEndDate && values.bookingEndDate.date ? values.bookingEndDate.date : null;
    const startTimeDisabled = !bookingStartDate;
    const endTimeDisabled = !bookingEndDate;

    const classes = classNames(rootClassName || css.fieldRoot, className);

    const availableStartHours = getAvailableHours(intl, bookingStartDate);
    const availableEndHours = getAvailableHours(intl, bookingEndDate);
    const requireMessage = intl.formatMessage({ id: 'BookingDateTimeForm.fieldRequired' });
    const placeholderTime = localizeAndFormatTime(TODAY);

    return (
      <div className={classes}>
        <div className={css.formRow}>
          <div className={css.field}>
            <FieldDateInput
              className={css.fieldDateInput}
              name="bookingStartDate"
              id={formId ? `${formId}.bookingStartDate` : 'bookingStartDate'}
              label={startDateLabel}
              placeholderText={startDatePlaceholderText}
              onChange={this.onBookingStartDateChange}
              focused={focusedInput === START_DATE}
              format={format}
              showErrorMessage={false}
              validate={bookingDateRequired(requireMessage)}
            />
          </div>
          <div className={css.field}>
              <FieldSelect
                name="bookingStartTime"
                id={formId ? `${formId}.bookingStartTime` : 'bookingStartTime'}
                className={bookingStartDate ? css.fieldSelect : css.fieldSelectDisabled}
                label={startTimeLabel}
                selectClassName={bookingStartDate ? css.select : css.selectDisabled}
                disabled={startTimeDisabled}
                onChange={this.onBookingStartTimeChange}
                showErrorMessage={false}
                validate={bookingStartTimeAtLeast('', AT_LEAST_HOURS)}
              >
                {bookingStartDate ? (
                  availableStartHours.map(p => (
                    <option key={p.timeOfDay} value={p.timestamp}>
                      {p.timeOfDay}
                    </option>
                  ))
                ) : (
                  <option>{placeholderTime}</option>
                )}
              </FieldSelect>
            </div>
          </div>
        <div className={css.formRow}>
          <div className={css.field}>
            <FieldDateInput
              className={css.fieldDateInput}
              name="bookingEndDate"
              id={formId ? `${formId}.bookingEndDate` : 'bookingEndDate'}
              label={endDateLabel}
              focused={focusedInput === END_DATE}
              format={format}
              placeholderText={endDatePlaceholderText}
              onChange={this.onBookingEndDateChange}
              showErrorMessage={false}
              isOutsideRange={day =>
                this.isOutsideRange(day, bookingStartDate)
              }
              validate={bookingDateRequired(requireMessage)}
            />
          </div>
          <div className={css.field}>
              <FieldSelect
                name="bookingEndTime"
                id={formId ? `${formId}.bookingEndTime` : 'bookingEndTime'}
                className={bookingEndDate ? css.fieldSelect : css.fieldSelectDisabled}
                label={endTimeLabel}
                selectClassName={bookingEndDate ? css.select : css.selectDisabled}
                disabled={endTimeDisabled}
                onChange={this.onBookingEndTimeChange}
                showErrorMessage={false}
                validate={required(requireMessage)}
              >
                {bookingEndDate ? (
                  availableEndHours.map(p => (
                    <option key={p.timeOfDay} value={p.timestamp}>
                      {p.timeOfDay}
                    </option>
                  ))
                ) : (
                  <option>{placeholderTime}</option>
                )}
              </FieldSelect>
            </div>
          </div>
      </div>
    );
  }
}

FieldDateTimeRangeInput.defaultProps = {
  className: null,
  rootClassName: null,
  endDateLabel: null,
  endTimeLabel: null,
  endDatePlaceholderText: null,
  startDateLabel: null,
  startTimeLabel: null,
  startDatePlaceholderText: null,
  timeSlots: null,
  focusedInput: null,
  formId: null,
};

FieldDateTimeRangeInput.propTypes = {
  className: string,
  rootClassName: string,
  endDateLabel: string,
  endTimeLabel: string,
  endDatePlaceholderText: string,
  startDateLabel: string,
  startTimeLabel: string,
  startDatePlaceholderText: string,
  timeSlots: arrayOf(propTypes.timeSlot),
  focusedInput: string,
  formId: string,
  intl: intlShape.isRequired,
  format: func,
};

export default FieldDateTimeRangeInput;
