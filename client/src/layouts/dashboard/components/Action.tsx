import { FC } from 'react';
import { BiSearchAlt, BiMessageSquareEdit } from 'react-icons/bi';
import { FiTrash2 } from 'react-icons/fi';
import { TbLock, TbLockOpen, TbPassword } from 'react-icons/tb';

interface ActionProps {
   block?: boolean;
   onBlock?: () => void;
   onDetail?: () => void;
   onEdit?: () => void;
   onDelete?: () => void;
   onResetPasswod?: () => void;
}

const Action: FC<ActionProps> = ({
   block,
   onBlock,
   onDetail,
   onEdit,
   onDelete,
   onResetPasswod,
}) => {
   const action = {
      isBlock: !!onBlock,
      isDetail: !!onDetail,
      isEdit: !!onEdit,
      isDelete: !!onDelete,
      isResetPasswod: !!onResetPasswod,
   };

   return (
      <div className='flex justify-center items-center text-lg space-x-3'>
         {action.isBlock &&
            (block ? (
               <div
                  className='cursor-pointer duration-150 hover:scale-110'
                  onClick={onDetail}
               >
                  <TbLock />
               </div>
            ) : (
               <div
                  className='cursor-pointer duration-150 hover:scale-110'
                  onClick={onDetail}
               >
                  <TbLockOpen />
               </div>
            ))}

         {action.isDetail && (
            <div
               className='cursor-pointer duration-150 hover:scale-110'
               onClick={onDetail}
            >
               <BiSearchAlt />
            </div>
         )}
         {action.isResetPasswod && (
            <div
               className='cursor-pointer duration-150 hover:scale-110'
               onClick={onResetPasswod}
            >
               <TbPassword />
            </div>
         )}
         {action.isEdit && (
            <div
               className='cursor-pointer duration-150 hover:scale-110'
               onClick={onEdit}
            >
               <BiMessageSquareEdit />
            </div>
         )}
         {action.isDelete && (
            <div
               className='cursor-pointer duration-150 hover:scale-110'
               onClick={onDelete}
            >
               <FiTrash2 />
            </div>
         )}
      </div>
   );
};

export default Action;
