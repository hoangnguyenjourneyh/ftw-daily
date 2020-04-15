import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';

import css from '../ListingPage/ListingPage.css';

const SectionTeachingHoursMaybe = props => {
  const { teachingHours, teachingHoursOptions } = props;
  const selectedItem = teachingHoursOptions.find(element => element.key === teachingHours);
  const label = selectedItem && selectedItem.label;
  return label ? (
    <div className={css.sectionDescription}>
      <h2 className={css.descriptionTitle}>
        <FormattedMessage id="TeacherListingPage.hourTitle" />
      </h2>
      <p className={css.description}>
        {label}
      </p>
    </div>
  ) : null;
};

export default SectionTeachingHoursMaybe;
