const async = require('async');
const _ = require('lodash');
const { db_config ,query_config } = require('./../config');
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

async function getKlineDatas(){
    const { ip ,port ,database , measurement } = db_config;
    const { time_range } = query_config;
    const instrument_list = await getInstrumentId();
}