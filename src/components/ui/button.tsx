const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="cursor-pointer rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
