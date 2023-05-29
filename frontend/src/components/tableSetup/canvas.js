import { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Card from "./card";
import { Col, Row } from "react-bootstrap";

function Canvas(props) {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop({
    accept: "column",
    drop: (item) => {
      setDroppedItems((prevItems) => [...prevItems, item.column]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const removeItem = (key) => {
    const index = droppedItems.findIndex((column) => column.key === key);
    setDroppedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const updateItem = (key, column) => {
    const index = droppedItems.findIndex((column) => column.key === key);
    setDroppedItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = column;
      return updatedItems;
    });
  };

  const { addRemoveColumn } = props;

  useEffect(() => {
    addRemoveColumn(droppedItems);
  }, [droppedItems, addRemoveColumn]);

  const canvas = {
    backgroundColor: isOver ? "cornflowerblue" : "#f1f1f1",
    height: "500px",
  };

  return (
    <div ref={drop} className="canvas" style={canvas}>
      <Row className="m-0 p-2">
        {droppedItems.map((column, index) => (
          <Col key={index} xs={14} sm={7} md={5} lg={2}>
            <Card
              key={column.key}
              id={index}
              column={column}
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
