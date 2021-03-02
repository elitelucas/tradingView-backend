const Database = require('../database/Database.js');

module.exports = {
    async getData(req, res) {
        const d = await new Database();
        let fsym = req.query.fsym ? req.query.fsym : "GBP";
        let tsym = req.query.tsym ? req.query.tsym : "USD";
        let resolution = 1;
        if (req.query.resolution < 60)
            resolution = req.query.resolution + "M";
        else if (req.query.resolution < 1440)
            resolution = (req.query.resolution / 60) + "H";
        else if (req.query.resolution >= 1440)
            resolution = (req.query.resolution / 1440) + "D";
        else
            resolution = resolution + "M";
        //generate the table name from the query of the request
        const table = fsym + tsym + "_" + resolution;
        //set the range to read data
        let date = new Date(req.query.toTs * 1000);
        const now = Date.now();
        let toRange = req.query.toTs ? `${date.getDate()}/${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()}` : `${now.getDate()}/${(now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)}/${now.getFullYear()}`;
        date = new Date(req.query.fromTs * 1000);
        let fromRange = req.query.fromTs ? `${date.getDate()}/${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()}` : `${now.getDate()}/${(now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)}/${now.getFullYear()}`;
        // console.log(`
        // SELECT  id, datetime, open, close, low, high, volumen from "ADMIN"."${table}"
        // WHERE TRUNC(DATETIME)>=TO_DATE(${fromRange},'dd/mm/yyyy') and TRUNC(DATETIME)<=TO_DATE(${toRange},'dd/mm/yyyy')
        // ORDER BY DATETIME ASC
        // FETCH FIRST ${req.query.limit} ROWS ONLY
        // `);
        //exceute the query
        let tmp_result = await d.query(`
        SELECT  id, datetime, open, close, low, high, volumen from "ADMIN"."${table}"
        WHERE TRUNC(DATETIME)>=TO_DATE(:fromRange,'dd/mm/yyyy') and TRUNC(DATETIME)<=TO_DATE(:toRange,'dd/mm/yyyy')
        ORDER BY DATETIME ASC
        FETCH FIRST ${req.query.limit} ROWS ONLY
        `
            , { fromRange, toRange });
        if (tmp_result.rows.length > 0) {
            const result = {};
            //data conversion for the trdaingView to read
            result.Data = tmp_result.rows.map(ele => {
                return {
                    time: (new Date(ele[1])).getTime() / 1000,
                    close: ele[3],
                    conversionSymbol: "",
                    conversionType: "force_direct",
                    high: ele[5],
                    low: ele[4],
                    open: ele[2],
                    volumefrom: ele[6],
                    volumeto: ele[6]
                }
            });
            result.Aggregated = false;
            result.ConversionType = {
                type: "force_direct",
                conversionSymbol: ""
            };
            result.FirstValueInArray = true;
            result.HasWarning = false;
            result.Response = "Success";
            result.Type = tmp_result.rows.length;
            result.TimeFrom = result.Data[0].time;
            result.TimeTo = result.Data[result.Type - 1].time;

            res.send(result);
        } else {
            tmp_result = await d.query(`
            SELECT  id, datetime, open, close, low, high, volumen from "ADMIN"."${table}"            
            ORDER BY DATETIME DESC
            FETCH FIRST ${req.query.limit} ROWS ONLY
            `);
            const result = {};
            //data conversion for the trdaingView to read
            result.Data = tmp_result.rows.map(ele => {
                return {
                    time: (new Date(ele[1])).getTime() / 1000,
                    close: ele[3],
                    conversionSymbol: "",
                    conversionType: "force_direct",
                    high: ele[5],
                    low: ele[4],
                    open: ele[2],
                    volumefrom: ele[6],
                    volumeto: ele[6]
                }
            }).reverse();
            result.Aggregated = false;
            result.ConversionType = {
                type: "force_direct",
                conversionSymbol: ""
            };
            result.FirstValueInArray = true;
            result.HasWarning = false;
            result.Response = "Success";
            result.Type = tmp_result.rows.length;
            result.TimeFrom = result.Data[0].time;
            result.TimeTo = result.Data[result.Type - 1].time;

            res.send(result);
        }

    }
}



