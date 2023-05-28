import { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Card from "./card";
import { Col, Row } from "react-bootstrap";

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
    backgroundColor: isOver ? "cornflowerblue" : "#f1f1f1",
    height: "500px",
  };

  return (
    <div ref={drop} className="canvas" style={canvas}>
      <Row className="m-0 p-0">
        {droppedItems.map((item, index) => (
          <Col key={index} xs={14} sm={7} md={5} lg={2}>
            <Card
              id={index}
              index={index}
              item={item}
              removeCard={removeItem}
              updateCard={updateItem}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Canvas;
