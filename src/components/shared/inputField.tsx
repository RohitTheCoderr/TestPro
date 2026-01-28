function InputField({ label, icon, formError, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <div
        className="flex items-center gap-2 rounded-lg border
                      border-zinc-300 dark:border-zinc-700
                      bg-transparent px-3 h-11"
      >
        <span className="text-zinc-500">{icon}</span>
        <input
          {...props}
          className="flex-1 bg-transparent outline-none text-sm
                     text-zinc-800 dark:text-white"
        />
      </div>
      {formError && (
        <p className="text-red-500 dark:text-white text-xs sm:text-sm text-left mt-2">
          {formError}
        </p>
      )}
    </div>
  );
}

export default InputField;
