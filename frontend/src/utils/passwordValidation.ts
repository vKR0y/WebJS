/**
 * Jelszó validációs függvények és követelmények
 */

export interface PasswordRequirement {
  text: string;
  regex: RegExp;
  met: boolean;
}

export function validatePasswordStrength(password: string): PasswordRequirement[] {
  return [
    {
      text: "Minimum 8 karakter",
      regex: /.{8,}/,
      met: /.{8,}/.test(password)
    },
    {
      text: "Legalább 1 kisbetű (a-z)",
      regex: /[a-z]/,
      met: /[a-z]/.test(password)
    },
    {
      text: "Legalább 1 nagybetű (A-Z)",
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password)
    },
    {
      text: "Legalább 1 szám (0-9)",
      regex: /\d/,
      met: /\d/.test(password)
    },
    {
      text: "Legalább 1 speciális karakter (!@#$%^&*(),.?\":{}|<>)",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];
}

export function isPasswordStrong(password: string): boolean {
  const requirements = validatePasswordStrength(password);
  return requirements.every(req => req.met);
}

export function getPasswordErrors(password: string): string[] {
  const requirements = validatePasswordStrength(password);
  return requirements.filter(req => !req.met).map(req => req.text);
}
