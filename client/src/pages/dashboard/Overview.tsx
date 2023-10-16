import { PageTitle } from '@/components';
import 'chart.js/auto';
import Title from '@/layouts/dashboard/components/Title';
import { Col, Row } from 'antd';
import { TiMessages } from 'react-icons/ti';
import { Pie } from 'react-chartjs-2';

function Overviews() {
   const data = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
         {
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
         },
      ],
   };

   return (
      <>
         <PageTitle title='Overviews' />
         <Title title='Overviews' />
         <div className='mt-6 min-h-full'>
            <Row gutter={[24, 24]}>
               <Col span={6}>
                  <div className='h-36 rounded-md flex justify-between items-center p-5'>
                     <div className='flex flex-col justify-center space-y-3'>
                        <div className='text-4xl font-medium'>49</div>
                        <span className='font-normal text-gray-300'>
                           Products
                        </span>
                     </div>
                     <div className='text-5xl'>
                        <TiMessages />
                     </div>
                  </div>
               </Col>

               <Col span={6}>
                  <div className='h-36 rounded-md flex justify-between items-center p-5'>
                     <div className='flex flex-col justify-center space-y-3'>
                        <div className='text-4xl font-medium'>20</div>
                        <span className='font-normal text-gray-300'>
                           Customers
                        </span>
                     </div>
                     <div className='text-5xl'>
                        <TiMessages />
                     </div>
                  </div>
               </Col>

               <Col span={6}>
                  <div className='h-36 rounded-md flex justify-between items-center p-5'>
                     <div className='flex flex-col justify-center space-y-3'>
                        <div className='text-4xl font-medium'>222</div>
                        <span className='font-normal text-gray-300'>
                           Comments
                        </span>
                     </div>
                     <div className='text-5xl'>
                        <TiMessages />
                     </div>
                  </div>
               </Col>

               <Col span={6}>
                  <div className='h-36 rounded-md flex justify-between items-center p-5'>
                     <div className='flex flex-col justify-center space-y-3'>
                        <div className='text-4xl font-medium'>22</div>
                        <span className='font-normal text-gray-300'>
                           Orders
                        </span>
                     </div>
                     <div className='text-5xl'>
                        <TiMessages />
                     </div>
                  </div>
               </Col>
               <Col span={12}></Col>
               <Col span={12}>
                  <div className='flex justify-center'>
                     <div className='w-1/2 py-8'>
                        <Pie data={data} />
                     </div>
                  </div>
               </Col>
            </Row>
         </div>
      </>
   );
}

export default Overviews;
