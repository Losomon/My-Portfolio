export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  organization: { max: 150 },
  service: { max: 100 },
  message: { min: 10, max: 5000 },
} as const;

export type ContactField =
  | 'name'
  | 'email'
  | 'organization'
  | 'service'
  | 'message';

export type ContactValues = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_FIELD_ORDER: ContactField[] = [
  'name',
  'email',
  'organization',
  'service',
  'message',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function trimValue(value: unknown): string {
  return asString(value).trim();
}

export function validateContact(input: unknown): {
  values: ContactValues;
  errors: ContactErrors;
} {
  const source =
    input && typeof input === 'object'
      ? (input as Record<string, unknown>)
      : {};

  const values: ContactValues = {
    name: trimValue(source.name),
    email: trimValue(source.email).toLowerCase(),
    organization: trimValue(source.organization),
    service: trimValue(source.service),
    message: trimValue(source.message),
  };

  const errors: ContactErrors = {};

  if (!values.name) {
    errors.name = 'Please enter your name.';
  } else if (values.name.length < CONTACT_LIMITS.name.min) {
    errors.name = `Your name must be at least ${CONTACT_LIMITS.name.min} characters.`;
  } else if (values.name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Your name must be ${CONTACT_LIMITS.name.max} characters or fewer.`;
  }

  if (!values.email) {
    errors.email = 'Please enter your email address.';
  } else if (
    values.email.length > CONTACT_LIMITS.email.max ||
    !EMAIL_PATTERN.test(values.email)
  ) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.organization.length > CONTACT_LIMITS.organization.max) {
    errors.organization = `Your organization must be ${CONTACT_LIMITS.organization.max} characters or fewer.`;
  }

  if (values.service.length > CONTACT_LIMITS.service.max) {
    errors.service = 'Please choose a service from the list.';
  }

  if (!values.message) {
    errors.message = 'Please describe your project.';
  } else if (values.message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Your project description must be at least ${CONTACT_LIMITS.message.min} characters.`;
  } else if (values.message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Your project description must be ${CONTACT_LIMITS.message.max} characters or fewer.`;
  }

  return { values, errors };
}

export function hasContactErrors(errors: ContactErrors): boolean {
  return CONTACT_FIELD_ORDER.some((field) => Boolean(errors[field]));
}

export function firstContactErrorField(
  errors: ContactErrors,
): ContactField | undefined {
  return CONTACT_FIELD_ORDER.find((field) => Boolean(errors[field]));
}