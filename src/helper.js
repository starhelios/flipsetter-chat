export const getPasswordStrength = (password) => {
  // minimum 8 characters
  const bad = /(?=.{8,}).*/;
  // Alpha Numeric plus minimum 8
  const good = /^(?=\S*?[a-z])(?=\S*?[0-9])\S{8,}$/;
  // Must contain at least one upper case letter, one lower case
  // letter and (one number OR one special char).
  const better = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9])|(?=\S*?[^\w\*]))\S{8,}$/;
  //   Must contain at least one upper case letter, one lower case
  //    letter and (one number AND one special char).
  const best = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^\w\*])\S{8,}$/;

  let status = 'weak';
  let color = '#d9534f';
  if (best.test(password)) {
    status = '<i class="fas fa-thumbs-up"></i> Very Strong!';
    color = '#5cb85c';
  } else if (better.test(password)) {
    status = '<i class="fas fa-hand-point-right"></i> Strong';
    color = '#5cb85c';
  } else if (good.test(password)) {
    status = 'still Weak';
    color = '#f0ad4e';
  } else if (bad.test(password)) {
    status = 'Weak';
  } else {
    status = 'Very Weak';
  }
  return { status, color };
};
