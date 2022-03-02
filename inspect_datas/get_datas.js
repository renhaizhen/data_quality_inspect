const async = require('async');
const _ = require('lodash');
const { db_config ,query_config } = require('./../config');
const { getStartEndTime } = require('./../utils/transform');
const dbLink = require('./../lib/dblink/influx');

async function getInstrumentId(){
    const { query_field } = query_config;
    const instrument_list = []
    _.forEach(query_field,l=>{
        _.forEach(l.pair,m=>{
            const exchange = l.exchange;
            const asset_type = l.asset_type;
            const o = `${exchange}_${asset_type}_${m}`;
            instrument_list.push(o)
        })
    })
    return instrument_list
}


async function getKlineSQL(measurement){
    const { time_range ,time_start ,time_end } = query_config;
    const instrument_list = await getInstrumentId();
    const from_to = await getStartEndTime(time_start,time_end,time_range);
    console.log(from_to)
    const sql_list = [];
    if(instrument_list&&from_to.length){
        _.forEach(from_to,l=>{
            _.forEach(instrument_list,instrument_id=>{
                const sql = `SELECT "close","instrument_id" FROM "${measurement}" WHERE  instrument_id = '${instrument_id}' and  time >= ${l.from} and time<= ${l.to} limit 5`;
                sql_list.push(sql)
            })
        })
        return sql_list
    }
}

async function getQueryRow(sql){
    const { ip ,port ,database , measurement } = db_config;
    const sqls = await getKlineSQL(measurement);
    var dbL = new dbLink({host:ip,port,database});
    async.mapLimit(sqls, 2, async function(sql) {
        let res = await dbL.queryRaw(database,sql);
        if(res&&res.results&&res.results[0].series){
            let handle_data = dbL.getInfluxData(res);
            console.log(handle_data)
        }
        console.log(res,'......',sql)
        return
    }, (err, results) => {
        if (err) throw err
        // results is now an array of the response bodies
        // console.log(results)
    })
}
getQueryRow()