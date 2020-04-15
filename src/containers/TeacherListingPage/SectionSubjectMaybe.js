import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { PropertyGroup } from '../../components';

import css from '../ListingPage/ListingPage.css';

const SectionFeaturesMaybe = props => {
  const { subjectOptions, levelOptions, publicData } = props;
  if (!publicData) {
    return null;
  }

  const selectedSubjects = publicData && publicData.subjects ? publicData.subjects : [];
  const selectedLevels = publicData && publicData.levels ? publicData.levels : [];
  
  return (
    <div>
        <div className={css.sectionFeatures}>
        <h2 className={css.featuresTitle}>
            <FormattedMessage id="TeacherListingPage.subjectTitle" />
        </h2>
        <PropertyGroup
            id="TeacherListingPage.subject"
            options={subjectOptions}
            selectedOptions={selectedSubjects}
            twoColumns={true}
        />
        </div>
        <div className={css.sectionFeatures}>
        <h2 className={css.featuresTitle}>
            <FormattedMessage id="TeacherListingPage.levelTitle" />
        </h2>
        <PropertyGroup
            id="TeacherListingPage.level"
            options={levelOptions}
            selectedOptions={selectedLevels}
            twoColumns={true}
        />
        </div>
    </div>
    
  );
};

export default SectionFeaturesMaybe;
