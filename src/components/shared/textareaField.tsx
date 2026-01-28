function TextAreaField({ label, icon, formError, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
      </label>
      <div
        className="flex gap-2 rounded-lg border
                      border-zinc-300 dark:border-zinc-700
                      bg-transparent px-3 py-2"
      >
        <span className="text-zinc-500 mt-1">{icon}</span>
        <textarea
          {...props}
          rows={4}
          className="flex-1 bg-transparent outline-none text-sm
                     text-zinc-800 dark:text-white resize-none"
        />
      </div>
      {formError && (
        <p className="text-red-500 text-xs sm:text-sm text-left mt-2">
          {formError}
        </p>
      )}
    </div>
  );
}

export default TextAreaField;
