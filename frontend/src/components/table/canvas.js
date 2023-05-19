import { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Card from "./card";

function Canvas(props) {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop({
    accept: "column",
    drop: (item) => {
      setDroppedItems((prevItems) => [...prevItems, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const removeItem = (key) => {
    const index = droppedItems.findIndex((item) => item.column.key === key);
    setDroppedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const updateItem = (key, item) => {
    const index = droppedItems.findIndex((item) => item.column.key === key);
    setDroppedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = item;
      return updatedItems;
    });
  };

  const { addRemoveColumn } = props;

  useEffect(() => {
    const columns = droppedItems.map((item) => {
      return {
        column_name: item.column.column,
        column_type: item.column.datatype,
        key: item.column.key,
        nullable: item.column.nullable,
        table_name: item.column.table_name,
      };
    });

    addRemoveColumn(columns);
  }, [droppedItems, addRemoveColumn]);

  const canvas = {
    maxWidth: "700px",
    height: "500px",
    backgroundColor: isOver ? "cornflowerblue" : "#f1f1f1",
    display: "flex",
    flexWrap: "wrap",
  };

  return (
    <div ref={drop} className="canvas" style={canvas}>
      {droppedItems.map((item, index) => (
        <div key={index}>
          <Card column={item} removeCard={removeItem} updateCard={updateItem} />
        </div>
      ))}
    </div>
  );
}

export default Canvas;
