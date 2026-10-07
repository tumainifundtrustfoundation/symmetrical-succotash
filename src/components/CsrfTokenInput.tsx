import React from 'react';
import { useCsrfProtection } from '../hooks/useCsrfProtection';

interface CsrfTokenInputProps {
  name?: string;
  id?: string;
}

/**
 * Invisible CSRF Token Input Component.
 * Can be placed inside any sensitive <form> to supply the anti-CSRF token
 * in standard form payload submissions (`_csrf`).
 */
export const CsrfTokenInput: React.FC<CsrfTokenInputProps> = ({
  name = '_csrf',
  id = 'csrf_security_token',
}) => {
  const { csrfToken } = useCsrfProtection();

  if (!csrfToken) {
    return null;
  }

  return (
    <input
      type="hidden"
      name={name}
      id={id}
      value={csrfToken}
      autoComplete="off"
      readOnly
    />
  );
};

export default CsrfTokenInput;
