(async () => {
    const googleTrends = require("google-trends-api");
    const { DateTime } = require("luxon");

    const { readFromFile, writeToFile, writeToLogFile } = require("./handler/fileHandler");
    const { sleep } = require("./handler/utilHandler");

    const start_running_time = DateTime.local();
    console.log(`Start at ${start_running_time.toString()}!`);
    await writeToLogFile("Start!");

    let interestOverTimeDataset = [];
    let interestByRegionDataset = [];

    let inputContent = await readFromFile("keywords.csv");

    let payload = {
        keyword: "",
        startTime: new Date("2020-06-30"),
        endTime: new Date("2020-07-30"),
        geo: "",
        hl: "en-US",
        timezone: -420,
        category: 0,
    };

    // use for loop instead of forEach because to avoid the change the order of code when running
    for (let i = 0; i < inputContent.length; i++) {
        payload.keyword = inputContent[i].keyword;

        if (i > 0) {
            await sleep(120000);
        }

        await googleTrends
            .interestOverTime(payload)
            .then((res) => {
                // console.log(res);
                console.log(`Successfully find 'Interest over time' data with payload: ${JSON.stringify(payload)}`);
                writeToLogFile(`Successfully find 'Interest over time' data with payload: ${JSON.stringify(payload)}`);

                let resultObjct = JSON.parse(res);
                let data = resultObjct.default.timelineData;
                data.forEach((ele) =>
                    interestOverTimeDataset.push({
                        keyword: payload.keyword,
                        time: ele.time,
                        formattedTime: ele.formattedTime,
                        value: ele.value[0],
                        formattedValue: ele.formattedValue[0],
                    })
                );
            })
            .catch((err) => {
                console.log(
                    `Unsuccessfully find 'Interest over time' data with payload: ${JSON.stringify(
                        payload
                    )} return error: ${JSON.stringify(err)}`
                );
                writeToLogFile(
                    `Unsuccessfully find 'Interest over time' data with payload: ${JSON.stringify(
                        payload
                    )} return error: ${JSON.stringify(err)}`
                );
            });

        payload.resolution = "COUNTRY";
        await googleTrends
            .interestByRegion(payload)
            .then((res) => {
                // console.log(res);
                console.log(`Successfully find 'Interest by region' data with payload: ${JSON.stringify(payload)}`);
                writeToLogFile(`Successfully find 'Interest by region' data with payload: ${JSON.stringify(payload)}`);

                let resultObjct = JSON.parse(res);
                let data = resultObjct.default.geoMapData;
                data.forEach((ele) =>
                    interestByRegionDataset.push({
                        keyword: payload.keyword,
                        geoCode: ele.geoCode,
                        geoName: ele.geoName,
                        value: ele.value[0],
                        formattedValue: ele.formattedValue[0],
                    })
                );
            })
            .catch((err) => {
                console.log(
                    `Unsuccessfully find 'Interest by region' data with payload: ${JSON.stringify(
                        payload
                    )} return error: ${JSON.stringify(err)}`
                );
                writeToLogFile(
                    `Unsuccessfully find 'Interest by region' data with payload: ${JSON.stringify(
                        payload
                    )} return error: ${JSON.stringify(err)}`
                );
            });
    }

    await writeToFile(
        "interestOverTime.csv",
        [
            { id: "keyword", title: "Keyword" },
            { id: "time", title: "Timestamp" },
            { id: "formattedTime", title: "Date" },
            { id: "value", title: "Value" },
            { id: "formattedValue", title: "Formatted Value" },
        ],
        false,
        interestOverTimeDataset
    );

    await writeToFile(
        "interestByRegion.csv",
        [
            { id: "keyword", title: "Keyword" },
            { id: "geoCode", title: "Georaphical code" },
            { id: "geoName", title: "Georaphical name" },
            { id: "value", title: "Value" },
            { id: "formattedValue", title: "Formatted Value" },
        ],
        false,
        interestByRegionDataset
    );

    const end_running_time = DateTime.local();
    const execution_time = end_running_time.diff(start_running_time, "seconds").toObject().seconds;
    console.log(`End at ${end_running_time.toString()}! Execution time in sec.: ${execution_time}`);
    writeToLogFile(`End! Execution time in sec.: ${execution_time}`);
})();
