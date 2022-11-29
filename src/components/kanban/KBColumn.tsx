const KBColumn = ({ columnCount }: { columnCount: number }) => {
  return (
    <div className=" inline-flex w-full">
      {[...Array(columnCount)].map((_, i) => (
        <div key={i} className="w-full border-[1px] bg-primary"></div>
      ))}
    </div>
  );
};

export default KBColumn;