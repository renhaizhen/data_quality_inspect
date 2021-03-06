const _ = require('lodash');

//search query influx
function getStartEndTime(start,end,interval){
    const start_time = new Date(start).getTime();
    const end_time = new Date(end).getTime();
    const interval_time = interval * 24 * 60 * 60 * 1000 ;
    const limit_time = end_time - start_time;
    const fromToList = [];
    for ( var i = 0;i<Math.floor(limit_time/interval_time) ;i++){
        const ft = {from:(end_time - interval_time * ( i+1 ))*Math.pow(10,6),to:(end_time - interval_time * i)*Math.pow(10,6)};
        fromToList.push(ft)
      }
    //   console.log(fromToList,start_time,end_time,start,end,interval)
      return fromToList
}

//judge is loss data
function judgeLossData(prev_time,next_time,instrument_id){
    const prev_timestamp = new Date(prev_time).getTime();
    const next_timestamp = new Date(next_time).getTime();
    if(next_timestamp-prev_timestamp>60000){//间隔
        console.log(`数据丢失❌ start:${prev_time}-end:${next_time}`);
        return {instrument_id,prev_time,next_time}
    }else{
        // console.log('数据正常')
    }
    // console.log(prev_timestamp,next_timestamp,next_timestamp-prev_timestamp)
}
//inspect datas
async function getInspectDatas(datas){
    if(datas&&datas.length){
        const len = datas.length;
        console.log('载入数据正常！',datas.length)
        const loss_details = []
        _.forEach(datas,(l,i)=>{
            if(i<len-1){
                const { time , instrument_id} = l;
                const next_time = datas[i+1]['time'];
                const loss_info = judgeLossData(time,next_time,instrument_id);
                if(loss_info!==undefined){
                    console.log(loss_info,'getInspectDatasgetInspectDatas');
                    loss_details.push(loss_info)
                }
            }
        })
        return loss_details
    }
}
module.exports = {
    getStartEndTime,
    getInspectDatas
}