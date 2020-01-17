"use strict";

const fs = require("fs");

var fileName =
  __dirname +
  "/logs/" +
  new Date().getFullYear().toString() +
  (new Date().getMonth() + 1).toString() +
  ".log";

if (!fs.existsSync(fileName)) {
  try {
    fs.writeFile(fileName, "", { flag: "wx" }, function(err) {
      if (err) {
        console.error(err);
      } else {
        var log_file_err = fs.createWriteStream(fileName, {
          flags: "a"
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
} else {
  var log_file_err = fs.createWriteStream(fileName, {
    flags: "a"
  });
}

exports.ok = function(message, data, res) {
  var result = {
    success: true,
    message: message ? message : null,
    data: data ? data : null
  };
  res.json(result);
  res.end();
};

exports.error = function(message, error, res) {
  let temp_error = error;
  if (error) {
    if (error.sql) {
      temp_error = error.original.message;
    }
  }
  var result = {
    success: false,
    message: message,
    error: temp_error ? temp_error : null,
    data: null
  };

  log_file_err.write(
    new Date() +
      "\n === " +
      message +
      " === \n " +
      JSON.stringify(error) +
      "\n === End " +
      message +
      " ===" +
      "\n\n"
  );
  res.json(result);
  res.end();
};
