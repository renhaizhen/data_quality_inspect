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


module.exports = {
    getStartEndTime
}