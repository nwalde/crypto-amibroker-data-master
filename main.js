const axios = require('axios');
const fs = require('fs');
const json2csv = require('json2csv');

const url = 'https://bittrex.com/api/v2.0/pub/market/getticks?marketname=usdt-btc&tickinterval=hour';
axios(url).then(
    response => {
        if(!response.data.success){
            console.log('FETCH FAILED FOR : BTC-USDT');
        }else{
            const csvData = json2csv({
                data:response.data.result,
                fields:[
                    {value:row=>row['T'].replace('T',',')},
                    {value:row=>row['O'].toFixed(8),stringify:false},
                    {value:row=>row['H'].toFixed(8),stringify:false},
                    {value:row=>row['L'].toFixed(8),stringify:false},
                    {value:row=>row['C'].toFixed(8),stringify:false},
                    {value:row=>row['V']}
                ],
                hasCSVColumnTitle:false,
                quotes:''
            });
            fs.writeFile('BTC-USDT.csv',csvData,'utf8',(error)=>{
                if(error){
                    console.log('WRITE FAILED FOR : BTC-USDT');
                }
            });
        }
    },
    error => console.log('FETCH FAILED FOR : BTC-USDT')
);
