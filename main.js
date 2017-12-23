const axios = require('axios');
const fs = require('fs');
const json2csv = require('json2csv');

axios('https://bittrex.com/api/v1.1/public/getmarkets').then(
    response => {
        response.data.result.forEach((market,index) => {
            if(market.MarketName.indexOf('BTC-')>-1){
                const url = 'https://bittrex.com/api/v2.0/pub/market/getticks?marketname='+market.MarketName+'&tickInterval=day';
                axios(url).then(
                    response => {
                        if(!response.data.success){
                            console.log('FETCH FAILED FOR : '+market.MarketName);
                        }else{
                            const csvData = json2csv({
                                data:response.data.result,
                                fields:[
                                    {value:row=>market.MarketName},
                                    {value:row=>row['T'].replace('T00:00:00','')},
                                    {value:row=>row['O'].toFixed(8),stringify:false},
                                    {value:row=>row['H'].toFixed(8),stringify:false},
                                    {value:row=>row['L'].toFixed(8),stringify:false},
                                    {value:row=>row['C'].toFixed(8),stringify:false},
                                    {value:row=>row['V']}
                                ],
                                hasCSVColumnTitle:false,
                                quotes:''
                            });
                            fs.writeFile('results/'+market.MarketName+'.txt',csvData,'utf8',(error)=>{
                                if(error){
                                    console.log('WRITE FAILED FOR : '+market.MarketName);
                                }
                            });
                        }
                    },
                    error => console.log('FETCH FAILED FOR : '+market.MarketName)
                );
            }
        });
    },
    error => console.log(error)
);