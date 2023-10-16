import { FC } from 'react';

interface TitleProps {
   title: string;
}

const Title: FC<TitleProps> = ({ title }) => {
   return <h3 className='text-[26px] font-medium'>{title}</h3>;
};

export default Title;
