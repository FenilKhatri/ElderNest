/**
 * Shared page width wrapper — uses full viewport width with responsive padding.
 * Use `constrained` only for forms / narrow reading content.
 */
const PageContainer = ({
  children,
  className = "",
  constrained = false,
  as: Component = "div",
}) => {
  const widthClass = constrained
    ? "w-full max-w-6xl mx-auto"
    : "w-full max-w-[100rem] mx-auto";

  return (
    <Component
      className={`${widthClass} px-4 sm:px-6 lg:px-8 2xl:px-10 ${className}`.trim()}
    >
      {children}
    </Component>
  );
};

export default PageContainer;
