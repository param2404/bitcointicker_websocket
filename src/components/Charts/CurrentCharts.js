/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { clientDateTime } from '../../@utils/currentDataTime';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const chartConfigs = {
    type: 'realtimeline',
    renderAt: 'container',
    width: '80%',
    height: '400',
    dataFormat: 'json',
};

let chartRef = FusionCharts("chartobject-1")

const Chart=React.memo(() =>{
    const [isLoading, setLoading] = useState(true)
    const [socketData, setSocketData] = useState('')
    const [dataSource, setDataSource] = useState({
        "chart": {
            "showShadow": 1,
            "lineThickness": '15px',
            "lineColor": "#43A3F4",
            "numDivLines": '10',
            "divLineColor": "#00A3F4",
            "numVDivLines": '10',
            "vDivLineAlpha": 40,
            "vDivLineDashed": 1,
            "caption": "Bitcoin",
            "subCaption": "",
            "xAxisName": "Local Time",
            "yAxisName": "USD",
            "numberPrefix": "$",
            "refreshinterval": "2",
            "slantLabels": "1",
            "numdisplaysets": "10",
            "labeldisplay": "rotate",
            "showValues": "0",
            "showRealTimeValue": "0",
            "theme": "fusion"
        },
        "categories": [{
            "category": [{
                "label": clientDateTime().toString()
            }]
        }],
        "dataset": [{
            "data": [{
                "value": 0
            }]
        }]
    })

    useEffect(() => {
        let ws='';
        try {
            const subscribe = {
                type: "subscribe",
                channels: [
                    {
                        name: "ticker",
                        product_ids: ["BTC-USD"],
                    },
                ],
            };

            ws = new WebSocket("wss://ws-feed.gdax.com");

            ws.onopen = () => {
                ws.send(JSON.stringify(subscribe));
            };

            ws.onmessage = (e) => {
                const value = JSON.parse(e.data);
                if (value.type !== "ticker") {
                    return;
                }
                setSocketData(value)
            }
        } catch (e) {
            console.log(e)
        }

        return () => {
            try {
                ws.close();
            } catch (e) {
                console.log(e)
            }
        }
    }, [])


    useEffect(() => {
        if (socketData === '') {
            let MyDataSource = dataSource;
            MyDataSource.chart.yAxisMaxValue = parseInt(socketData.price) + 100
            MyDataSource.chart.yAxisMinValue = parseInt(socketData.price) - 100
            MyDataSource.dataset[0]['data'][0].value = socketData.price;
            setLoading(false)
            setDataSource(MyDataSource)
        } else {
            let x_axis = clientDateTime();
            let y_axis = socketData.price;
            chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);

        }
    }, [socketData])


    const getChartRef = (chart) => {
        chartRef = chart;
    }


    return (
        <>
            {socketData !== '' && !isLoading && <h1 style={{ color: '#000' }}>${socketData.price}</h1>}
            <ReactFC
                {...chartConfigs}
                dataSource={dataSource}
                onRender={getChartRef.bind(this)} />
        </>

    )

})

export default Chart