interface WorkflowSelectProps<T> {
  options: T[];
  placeholder: string;
  disabled?: boolean;
  onSelect: (selectedItem: T) => void;
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  filterSelected?: (option: T) => boolean;
  className?: string;
}

export const WorkflowSelect = <T,>({
  options,
  placeholder,
  disabled = false,
  onSelect,
  getOptionValue,
  getOptionLabel,
  filterSelected,
  className = ""
}: WorkflowSelectProps<T>) => {
  const filteredOptions = filterSelected 
    ? options.filter(filterSelected)
    : options;

  return (
    <div className={`relative ${className}`}>
      <select
        className="w-full p-2 border border-border rounded-md appearance-none bg-white disabled:opacity-50 disabled:pointer-events-none"
        value=""
        onChange={(e) => {
          if (e.target.value) {
            const selectedItem = options.find(option => 
              getOptionValue(option) === e.target.value
            );
            if (selectedItem) {
              onSelect(selectedItem);
            }
            e.target.value = "";
          }
        }}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {filteredOptions.map((option) => (
          <option key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};