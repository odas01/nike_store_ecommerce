import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageTitleProps {
   title: string;
}

const PageTitle: FC<PageTitleProps> = ({ title }) => {
   return (
      <Helmet>
         <title>{title}</title>
      </Helmet>
   );
};

export default PageTitle;
