import { ScaleLoader } from 'react-spinners';

interface ILoadingOverlayProps {
   show?: boolean;
}

const LoadingOverlay: React.FC<ILoadingOverlayProps> = ({ show = false }) => {
   return (
      <div
         className='h-screen bg-[rgba(0,0,0,0.5)] fixed z-[20000] inset-0'
         style={{
            display: show ? 'block' : 'none',
         }}
      >
         <div className='flex items-center justify-center h-full'>
            <ScaleLoader
               color='white'
               width={6}
               height={40}
               loading={true}
               speedMultiplier={2}
            />
         </div>
      </div>
   );
};

export default LoadingOverlay;
