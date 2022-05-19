/* eslint-disable no-console */

function log (str) {
  if (process.env.NODE_ENV !== 'test' && process.env.LOGGING_LEVEL !== 'verbose') {
    console.log(str);
  }
}

function error (str) {
  if (process.env.NODE_ENV !== 'test' && process.env.LOGGING_LEVEL !== 'verbose') {
    console.error(str);
  }
}

const always = {
  log: (str) => console.log(str),
  error: (str) => console.error(str)
};

module.exports = {
  log,
  error,
  always
};

/* eslint-enable no-console */