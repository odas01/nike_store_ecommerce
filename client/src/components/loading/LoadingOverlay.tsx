import { ScaleLoader } from 'react-spinners';

interface ILoadingOverlayProps {
   show?: boolean;
}

const LoadingOverlay: React.FC<ILoadingOverlayProps> = ({ show = false }) => {
   return (
      <div
         className='h-[100vh] bg-[rgba(0,0,0,0.5)] fixed z-[20000] inset-0 flex justify-center items-center'
         style={{
            display: show ? 'block' : 'none',
         }}
      >
         <ScaleLoader
            color='white'
            width={6}
            height={40}
            loading={true}
            speedMultiplier={2}
         />
      </div>
   );
};

export default LoadingOverlay;
