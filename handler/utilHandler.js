const { DateTime } = require("luxon");

exports.logging = (message) => {
    return {
        datetime: DateTime.local().toString(),
        message: message,
    };
};

exports.sleep = async (timeMiliSeconds) => {
    return new Promise((resolve) => setTimeout(resolve, timeMiliSeconds));
};
