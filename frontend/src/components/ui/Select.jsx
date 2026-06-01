import CustomDropdown from "./CustomDropdown";

/**
 * Backward-compatible Select — uses CustomDropdown instead of native <select>.
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = "Select an option",
  className = "",
  multiple = false,
  searchable = false,
  disabled = false,
}) => {
  const handleChange = (val) => {
    if (onChange) {
      onChange({
        target: { name, value: val },
      });
    }
  };

  return (
    <CustomDropdown
      label={label}
      options={options}
      value={value ?? (multiple ? [] : "")}
      onChange={handleChange}
      placeholder={placeholder}
      multiple={multiple}
      searchable={searchable}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    />
  );
};

export default Select;
