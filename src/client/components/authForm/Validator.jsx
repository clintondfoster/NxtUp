import validator from "validator";

export function validateEmail(email) {
  if (!validator.isEmail(email)) {
    return "Please enter a valid email.";
  }
  return "";
}

export function validatePassword(password) {
  const requirements = [
    {
      description: "be at least 8 characters",
      test: (pass) => pass.length >= 8,
    },
    {
      description: "contain a number",
      test: (pass) => /\d/.test(pass),
    },
    {
      description: "contain a capital letter",
      test: (pass) => /[A-Z]/.test(pass),
    },
  ];

  const errors = requirements
    .map((req) => {
      if (!req.test(password)) {
        return req.description;
      }
      return null;
    })
    .filter(Boolean);

  if (errors.length > 0) {
    return "Password should: " + errors.join(", and ") + ".";
  }
  return "";
}
