const BackgroundGlow = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-[20%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 bottom-[10%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
    </>
  );
};

export default BackgroundGlow;
