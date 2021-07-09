function displayKey(key) {
  return (
    key.charAt(0).toUpperCase() + key.slice(1).replace(/[A-Z]/g, (c) => ` ${c}`)
  );
}

function requiredValidator(form, error) {
  return (key) => {
    const value = form[key];
    if (!value && value !== 0 && !error[key]) {
      error[key] = `${displayKey(key)} can't be blank`;
    }
  };
}

function validateLink(key, field) {
  if (!field) return;

  if (!field.startsWith('https://')) {
    return `${displayKey(key)} must start with https`;
  }

  if (
    !field.match(
      /^(https:\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
    )
  ) {
    return `${displayKey(key)} is not a valid url`;
  }
}

export const hasErrors = (errors) => {
  return Object.values(errors).some((errorGroup) =>
    Object.values(errorGroup).some(Boolean),
  );
};

export default function validateForm(about_you, your_experience, at_ht6) {
  const errors = {
    about_you: {},
    your_experience: {},
    at_ht6: {},
  };

  // Check required
  ['phoneNumber', 'gender', 'ethnicity', 'timezone']
    .concat(
      about_you.wantSwag
        ? ['addressLine1', 'city', 'province', 'postalCode']
        : [],
    )
    .forEach(requiredValidator(about_you, errors.about_you));
  ['school', 'program', 'yearsOfStudy', 'resume', 'hackathonsAttended'].forEach(
    requiredValidator(your_experience, errors.your_experience),
  );
  ['accomplishEssay', 'mlhCOC', 'mlhData'].forEach(
    requiredValidator(at_ht6, errors.at_ht6),
  );

  // Validate about_you data
  if (
    !errors.about_you.phoneNumber &&
    about_you.phoneNumber.match(/\d/g).length !== 10
  ) {
    errors.about_you.phoneNumber = 'Invalid phone number';
  }

  if (about_you.wantSwag) {
    if (
      !errors.about_you.postalCode &&
      !about_you.postalCode.match(
        /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][0-9][ABCEGHJ-NPRSTV-Z][0-9]$/,
      )
    ) {
      errors.about_you.postalCode = 'Invalid postal code';
    }
  }

  // Validate your_experience
  if (!errors.your_experience.githubLink) {
    errors.your_experience.githubLink = validateLink(
      'Github',
      your_experience.githubLink,
    );
  }

  if (!errors.your_experience.portfolioLink) {
    errors.your_experience.portfolioLink = validateLink(
      'Portfolio',
      your_experience.portfolioLink,
    );
  }

  if (!errors.your_experience.linkedinLink) {
    errors.your_experience.linkedinLink = validateLink(
      'Linkedin',
      your_experience.linkedinLink,
    );
  }

  if (!errors.your_experience.projectEssay) {
    const count = your_experience.projectEssay?.split(' ').length ?? 0;
    if (count !== 0 && count < 50) {
      errors.your_experience.projectEssay = `Project Essay must be atleast 50 words`;
    }
  }

  // Validate at_ht6
  if (!errors.at_ht6.requestedWorkshops) {
    const count = at_ht6.requestedWorkshops?.split(' ').length ?? 0;
    if (count !== 0 && count < 50) {
      errors.at_ht6.requestedWorkshops = `Workshop Essay must be atleast 50 words`;
    }
  }

  if (!errors.at_ht6.accomplishEssay) {
    const count = at_ht6.accomplishEssay?.split(' ').length ?? 0;
    if (count !== 0 && count < 50) {
      errors.at_ht6.accomplishEssay = `Accomplish Essay must be atleast 50 words`;
    }
  }

  return errors;
}
