const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
const { logging } = require("./utilHandler");

exports.readFromFile = async (path) => {
    return await csv().fromFile(path);
};

exports.writeToFile = async (path, header, append, content) => {
    let csvWriter = createCsvWriter({
        path: path,
        header: header,
        append: append,
    });

    await csvWriter.writeRecords(content);
    // console.log(`The data of ${path} file was written successfully!`);
    return;
};

exports.writeToLogFile = async (message) => {
    let logFilePath = "log.csv";
    let logFileHeader = [
        { id: "datetime", title: "Datetime" },
        { id: "message", title: "Message" },
    ];
    let isAppendToLogFile = true;

    // console.log("log message", message);
    await this.writeToFile(logFilePath, logFileHeader, isAppendToLogFile, [logging(message)]);
    return;
};
