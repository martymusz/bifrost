import { useDrag } from "react-dnd";

const COLUMN_TYPE = "column";

const Column = ({ column }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: COLUMN_TYPE,
    item: { column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div>{column.column_name}</div>
    </div>
  );
};

export default Column;
