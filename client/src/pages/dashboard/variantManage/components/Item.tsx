import { Variant } from '@/types';
import React, { FC } from 'react';

interface ItemProps {
   data: Variant;
}

const Item: FC<ItemProps> = ({ data }) => {
   console.log(data);

   return <div>Item</div>;
};

export default Item;
