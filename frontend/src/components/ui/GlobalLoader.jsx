const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Premium ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-40 animate-pulse" />

        <div
          className="w-20 h-20 rounded-full border-4 border-transparent 
          border-t-blue-500 border-r-purple-500 border-b-pink-500 
          animate-spin"
        />
      </div>
    </div>
  );
};

export default GlobalLoader;
