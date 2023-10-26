// import { FC, ReactNode } from 'react';
// import { Drawer } from 'antd';

// interface DrawerProps {
//    open: boolean;
//    onClose: () => void;
//    header?: ReactNode;
//    children: ReactNode;
//    footer?: ReactNode;
// }

// const Drawer: FC<DrawerProps> = ({
//    open,
//    onClose,
//    header,
//    children,
//    footer,
// }) => {
//    return (
//       <ReactDrawerDrawer open={open} onClose={onClose} direction='right' size={500}>
//          <div className='flex flex-col h-full'>
//             <div className='p-3 font-medium bg-[#cbcbcb] dark:bg-[#232323]'>
//                {header}
//             </div>
//             <div className='flex-1 dark:bg-[#111315] overflow-y-scroll'>
//                {children}
//             </div>
//             <div className='p-3 font-medium bg-[#cbcbcb] dark:bg-[#232323]'>
//                {footer}
//             </div>
//          </div>
//       </ReactDrawerDrawer>
//    );
// };

// export default Drawer;
