import React from 'react'
import SalesChart from './charts/SalesChart'

const Reports = () => {
    return <div>

        <div className='grid grid-cols-2'>
       
        <SalesChart />
        <SalesChart />
    </div>
     <div className='grid grid-cols-2'>
       
        <SalesChart />
        <SalesChart />
    </div>
    </div>
}

export default Reports