/* eslint-disable */
import React from 'react'
import TabPanel from './TabPanel'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AppBar, Tabs, Tab} from '@material-ui/core'
import Chart from './Charts/CurrentCharts'
import LineChart from './Charts/LineChart'
import moment from 'moment';


function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
}))

export default function FullWidthTabs() {
    const classes = useStyles()
    const theme = useTheme()
    const [value, setValue] = React.useState(0)
    const end = moment(new Date()).format('YYYY-MM-DD')
   

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleChangeIndex = (index) => {
        setValue(index)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="RealTime" {...a11yProps(0)} />
                    <Tab label="Year Data" {...a11yProps(1)} />
                    <Tab label="Month Data" {...a11yProps(2)} />
                    <Tab label="Yesterday" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Chart />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <LineChart
                        xaxis="Month"
                        endDate={end}
                        startDate={moment(new Date().setDate(new Date().getDate() - 365)).format('YYYY-MM-DD')}/>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <LineChart
                        xaxis="Day"
                        endDate={end}
                        startDate={moment(new Date().setDate(new Date().getDate() - 31)).format('YYYY-MM-DD')} />
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <LineChart
                        xaxis="Today"
                        endDate={end}
                        startDate={moment(new Date().setDate(new Date().getDate() - 1)).format('YYYY-MM-DD')}/>
                </TabPanel>
            </SwipeableViews>
        </div>
    )
}
