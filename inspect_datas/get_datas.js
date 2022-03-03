const async = require('async');
const _ = require('lodash');
const { db_config ,query_config } = require('./../config');
const { getStartEndTime ,getInspectDatas} = require('./../utils/transform');
const { saveJsonFile } = require('./save_lose_data');
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
    // console.log(from_to)
    const sql_list = [];
    if(instrument_list&&from_to.length){
        _.forEach(from_to,l=>{
            _.forEach(instrument_list,instrument_id=>{
                const sql = `SELECT "close","instrument_id" FROM "${measurement}" WHERE  instrument_id = '${instrument_id}' and  time >= ${l.from} and time<= ${l.to}`;
                sql_list.push(sql)
            })
        })
        return sql_list
    }
}
var loss_info = [];

function loop(fn,time){
    fn();
    setTimeout(()=>loop(fn,time),time);
}

function save2JsonFile (){
    const len = loss_info.length;
    if(len>0){
        saveJsonFile(loss_info);
        console.log('insert success！')
        loss_info = [];
    }else{
        console.log('暂未查询到缺失！',loss_info)
    }
}

loop(noop=>save2JsonFile(), 20 * 1000);

async function getQueryRow(){
    const { ip ,port ,database , measurement } = db_config;
    const sqls = await getKlineSQL(measurement);
    var dbL = new dbLink({host:ip,port,database});
    async.mapLimit(sqls, 2, async function(sql) {
        await new Promise(res => setTimeout(res, 3000));
        let res = await dbL.queryRaw(database,sql);
        if(res&&res.results&&res.results[0].series){
            let handle_data = dbL.getInfluxData(res);
            console.log(handle_data.length,'handle_data')
            let data = await getInspectDatas(handle_data);
            if(data!==undefined&&data.length){
                loss_info = loss_info.concat(data);
                console.log('loss push success',loss_info,data,data.length);
            }
            // console.log(handle_data)
        }
        // console.log(res,'......',sql)
        return
    }, (err, results) => {
        if (err) throw err
        // results is now an array of the response bodies
        // console.log(results)
    })
}
getQueryRow()