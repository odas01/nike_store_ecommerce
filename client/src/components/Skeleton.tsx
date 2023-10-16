const Skeleton = () => {
   return (
      <div
         role='status'
         className='animate-pulse space-y-2 [&>div]:rounded-md [&>div]:bg-gray-300 dark:[&>div]:bg-[#363943]'
      >
         <div className='h-8 mb-4'></div>
         <div className='h-10'></div>
         <div className='h-10'></div>
         <div className='h-10'></div>
         <div className='h-10'></div>
         <div className='h-10'></div>
         <span className='sr-only'>Loading...</span>
      </div>
   );
};

export default Skeleton;
