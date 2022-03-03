const fs = require('fs');
const async = require('async');

//insert data 2 file
async function insertData2File(datas){
    fs.readFile('./../files/loss_info.json','utf8',function(err,data){
        if(err)console.log(err);
        var row_data = JSON.parse(data);
        var hd = row_data.concat(datas);
        var insert_data=JSON.stringify(hd,null,4);
        fs.writeFileSync('./../files/loss_info.json',insert_data);
        console.log('insert finish')
        })
}
//save info 2 file
async function saveJsonFile(datas){
    if(datas&&datas.length){
        fs.readdir('./../files', async function (err, files) {
            if (err) {
              return console.log('目录不存在')
            }
            if(files.length>0){
                console.log('first--')
                await insertData2File(datas);
            }else{
                const hd = JSON.stringify(datas,null,4);
                fs.writeFile('./../files/loss_info.json',hd,(err)=>{
                    if (err) {
                        throw err;
                    }
                    console.log("JSON data is saved.");
                })
            }
          })
    }
}
const info = [
    {instrument_id:'BTC-QQQ',prev_time:'2020-12-11',next_time:'2033-12-23'},
    {instrument_id:'ETH-QQQ',prev_time:'2020-12-11',next_time:'2033-12-23'},
    {instrument_id:'LTC-QQQ',prev_time:'2020-12-11',next_time:'2033-12-23'},
    {instrument_id:'BT-QQQ',prev_time:'2020-12-11',next_time:'2033-12-23'},
    {instrument_id:'BC-QQQ',prev_time:'2020-12-11',next_time:'2033-12-23'},

]
// saveJsonFile(info)

module.exports = {
    saveJsonFile
}