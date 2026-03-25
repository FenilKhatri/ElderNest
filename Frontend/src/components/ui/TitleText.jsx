const TitleText = ({ children, className = "text-center" }) => {
  return (
    <>
      <p
        className={`text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 ${className}`}
      >
        {children}
      </p>
    </>
  );
};

export default TitleText;