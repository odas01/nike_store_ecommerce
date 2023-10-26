import { memo, useEffect, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Checkbox, Row, Col } from 'antd';
import { FaCheck } from 'react-icons/fa';
import { Collapse } from 'antd';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useQueries } from '@tanstack/react-query';
import { categoryApi, colorApi, sizeApi } from '@/api';
import { IColor } from '@/types';
import { Filter } from '@/pages/home/Shop';
import { store } from '@/constants';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components';
import { priceFormat } from '@/helpers';

type Props = {
   setFilter: React.Dispatch<React.SetStateAction<Partial<Filter>>>;
};

const Filter: React.FC<Props> = ({ setFilter }) => {
   const [priceOptions, setPriceOptions] = useState<string[]>([]);
   const [sizeOptions, setSizeOptions] = useState<string[]>([]);
   const [colorOptions, setColorOptions] = useState<string[]>([]);

   const { t, i18n } = useTranslation(['home', 'mutual']);
   const isVn = i18n.language === 'vi';

   const params = useParams();
   const results = useQueries({
      queries: [
         {
            queryKey: ['colors'],
            queryFn: () =>
               colorApi.getAll({
                  skip: 0,
                  limit: 100,
               }),
         },
         {
            queryKey: ['sizes'],
            queryFn: () =>
               sizeApi.getAll({
                  skip: 0,
                  limit: 100,
               }),
         },
         {
            queryKey: ['categories'],
            queryFn: () =>
               categoryApi.getAll({
                  skip: 0,
                  limit: 100,
               }),
         },
      ],
   });

   const [
      { data: colorData, isLoading: loading1 },
      { data: sizeData, isLoading: loading2 },
      { data: categoryData, isLoading: loading3 },
   ] = results;

   useEffect(() => {
      setPriceOptions([]);
      setSizeOptions([]);
      setColorOptions([]);

      setFilter({});
   }, [params]);

   const handleChange = (value: CheckboxValueType[]) => {
      setPriceOptions(value.map((item) => item.toString()));
      setFilter((state) => ({ ...state, price: value }));
   };

   const choseSize = (value: string) => {
      const isExist = sizeOptions.includes(value);

      let newSizeOptions: string[];

      if (isExist) {
         newSizeOptions = sizeOptions.filter((item) => item !== value);
      } else {
         newSizeOptions = [...sizeOptions, value];
      }

      setSizeOptions(newSizeOptions);
      setFilter((state) => ({ ...state, size: newSizeOptions }));
   };

   const chooesColor = ({ _id }: IColor) => {
      const isExist = colorOptions.includes(_id);

      let newColorOptions: string[];
      if (isExist) {
         newColorOptions = colorOptions.filter((item) => item !== _id);
      } else {
         newColorOptions = [...colorOptions, _id];
      }

      setColorOptions(newColorOptions);
      setFilter((state) => ({ ...state, color: newColorOptions }));
   };

   return (
      <div className='text-sm max-h-[670px] space-y-6 overflow-hidden overflow-y-auto scrollbar-hide flex flex-col'>
         {/* CATEGORY */}
         {loading1 ? (
            <Spinner />
         ) : (
            categoryData && (
               <div className='space-y-1 '>
                  <Link to={`/shop`} className='capitalize text-[15px]'>
                     {t('allProducts')}
                  </Link>
                  {store.map((storeItem, index) => (
                     <div key={index} className='space-y-1'>
                        <Link
                           to={`/shop/${storeItem}`}
                           className=' capitalize text-[15px]'
                        >
                           {t(`store.${storeItem}`, { ns: 'mutual' })}
                        </Link>
                        {storeItem === params.store && (
                           <div className='flex pl-6 flex-column'>
                              {categoryData?.categories
                                 .filter((item) => item.store === storeItem)
                                 .map((item, index) => (
                                    <NavLink
                                       key={index}
                                       to={`/shop/${item.store}/${item.name}`}
                                       className={({ isActive }) =>
                                          `capitalize mb-1  ${
                                             isActive
                                                ? 'font-semibold duration-150 transition-all text-[15px] !underline !underline-offset-4 !decoration-gray-600'
                                                : ''
                                          }`
                                       }
                                    >
                                       {isVn ? item.vnName : item.name}
                                    </NavLink>
                                 ))}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )
         )}
         {/* PRICE */}
         <Collapse
            accordion
            ghost
            expandIcon={({ isActive }) =>
               !isActive ? <AiOutlinePlus /> : <AiOutlineMinus />
            }
            expandIconPosition='end'
            defaultActiveKey={['1']}
            items={[
               {
                  key: '1',
                  label: (
                     <span className='text-[15px] text-[#252a2b] inline-block mb-2'>
                        {t('label.price', { ns: 'mutual' })}
                     </span>
                  ),
                  children: (
                     <Checkbox.Group
                        className='space-y-1 flex-column'
                        options={[
                           {
                              label: (
                                 <div className='space-x-1'>
                                    <span className='text-xs'>
                                       {t('category.filter.under')}
                                    </span>
                                    <span>{priceFormat(1000000, isVn)}</span>
                                 </div>
                              ),
                              value: '0:1000000',
                           },
                           {
                              label: (
                                 <div className='space-x-1'>
                                    <span>{priceFormat(1000000, isVn)}</span>
                                    <span>-</span>
                                    <span>{priceFormat(2999999, isVn)}</span>
                                 </div>
                              ),
                              value: '1000000:2999999',
                           },
                           {
                              label: (
                                 <div className='space-x-1'>
                                    <span>{priceFormat(3000000, isVn)}</span>
                                    <span>-</span>
                                    <span>{priceFormat(4999999, isVn)}</span>
                                 </div>
                              ),
                              value: '3000000:4999999',
                           },
                           {
                              label: (
                                 <div className='space-x-1'>
                                    <span className='text-xs'>
                                       {t('category.filter.over')}
                                    </span>
                                    <span>{priceFormat(5000000, isVn)}</span>
                                 </div>
                              ),
                              value: '5000000',
                           },
                        ]}
                        value={priceOptions}
                        onChange={handleChange}
                     />
                  ),
               },
            ]}
         />

         {/* SIZE */}
         {params.store &&
            (loading2 ? (
               <Spinner />
            ) : (
               sizeData && (
                  <Collapse
                     accordion
                     ghost
                     expandIcon={({ isActive }) =>
                        !isActive ? <AiOutlinePlus /> : <AiOutlineMinus />
                     }
                     expandIconPosition='end'
                     defaultActiveKey={['1']}
                     items={[
                        {
                           key: '1',
                           label: (
                              <span className='text-[15px] text-[#252a2b]'>
                                 {t('label.size', { ns: 'mutual' })}
                              </span>
                           ),
                           children: (
                              <Row gutter={[5, 5]}>
                                 {sizeData?.sizes
                                    .filter((item) =>
                                       params.store
                                          ? item.store === params.store
                                          : item
                                    )
                                    .map((item, index) => (
                                       <Col span={8} key={index}>
                                          <span
                                             className={`py-[5px] uppercase w-full h-[30px] block text-center transition-all border-b border-gray-300 rounded text-xs cursor-pointer          
                                       ${
                                          sizeOptions.includes(item.name)
                                             ? 'border-[#26acbb] border-b-[3px] text-[#26acbb]'
                                             : ' border-gray-300'
                                       }`}
                                             onClick={() =>
                                                choseSize(item.name)
                                             }
                                          >
                                             {item.name}
                                          </span>
                                       </Col>
                                    ))}
                              </Row>
                           ),
                        },
                     ]}
                  />
               )
            ))}

         {/* COLOR */}
         {loading3 ? (
            <Spinner />
         ) : (
            colorData && (
               <Collapse
                  accordion
                  ghost
                  expandIcon={({ isActive }) =>
                     !isActive ? <AiOutlinePlus /> : <AiOutlineMinus />
                  }
                  expandIconPosition='end'
                  defaultActiveKey={['1']}
                  items={[
                     {
                        key: '1',
                        label: (
                           <span className='text-[15px] text-[#252a2b] inline-block mb-4'>
                              {t('label.color', { ns: 'mutual' })} (
                              {colorData?.total})
                           </span>
                        ),
                        children: (
                           <Row gutter={[6, 12]}>
                              {colorData?.colors.map((item, index) => (
                                 <Col span={8} key={index}>
                                    <div className='flex flex-col items-center space-y-1'>
                                       <div
                                          className='flex items-center justify-center w-8 border rounded-full cursor-pointer aspect-square'
                                          style={{
                                             backgroundColor: item.value,
                                          }}
                                          onClick={() => chooesColor(item)}
                                       >
                                          {colorOptions.includes(item._id) && (
                                             <FaCheck
                                                color={
                                                   item.name === 'white'
                                                      ? '#000'
                                                      : '#fff'
                                                }
                                             />
                                          )}
                                       </div>
                                       <span className='text-xs font-semibold capitalize'>
                                          {isVn ? item.vnName : item.name}
                                       </span>
                                    </div>
                                 </Col>
                              ))}
                           </Row>
                        ),
                     },
                  ]}
               />
            )
         )}
      </div>
   );
};

export default memo(Filter);
