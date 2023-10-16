import { IProduct } from '@/types';
import { Col, Row } from 'antd';
import React from 'react';

interface ProductListProps {
   data: IProduct[];
   multipleColor?: boolean;
   quantityOfLine?: 4 | 6 | 8 | 12;
}

const ProductList: React.FC<ProductListProps> = ({
   data,
   multipleColor: quantityOfLine = 4,
}) => {
   return <div></div>;
};

export default ProductList;
