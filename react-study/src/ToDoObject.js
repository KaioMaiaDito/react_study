import { useReducer, useState } from "react";
import styled from "styled-components";

export default function ToDoObject() {
  const toDoList = {
    1: {
      id: 1,
      orderValue: 1,
      content: "Teste 1",
      checked: false,
      editting: false,
    },
    2: {
      id: 2,
      orderValue: 2,
      content: "Teste 2",
      checked: true,
      editting: false,
    },
    3: {
      id: 3,
      orderValue: 3,
      content: "Teste 3",
      checked: false,
      editting: false,
    },
    4: {
      id: 4,
      orderValue: 4,
      content: "Teste 4",
      checked: false,
      editting: false,
    },
  };

  const toDoDefault = {
    content: "",
    checked: false,
    editting: false,
  };

  const [textToDo, setTextToDo] = useState("");
  const [disableMove, setDisableMove] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false);
  const [newItemAdded, setNewItemAdded] = useState(false);

  const reducer = (state, condition) => {
    const { type, payload } = condition;
    if (state !== undefined) {
      const actualToDoList = { ...state };
      const actualID = payload.id ? payload.id : null;
      const actualItem = actualToDoList[actualID];
      switch (type) {
        case "toDo/moveUp":
          if (actualItem.orderValue > 1) {
            var index = Object.values(actualToDoList).findIndex(
              (item) => item.orderValue === actualItem.orderValue - 1
            );
            return {
              ...state,
              [actualID]: {
                ...actualItem,
                orderValue: actualItem.orderValue - 1,
              },
              [index + 1]: {
                ...Object.values(actualToDoList)[index],
                orderValue: actualItem.orderValue,
              },
            };
          }
          return { ...state };
        case "toDo/moveDown":
          if (actualItem.orderValue < Object.keys(actualToDoList).length) {
            var indexToMove = Object.values(actualToDoList).findIndex(
              (item) => item.orderValue === actualItem.orderValue + 1
            );
            return {
              ...state,
              [actualID]: {
                ...actualItem,
                orderValue: actualItem.orderValue + 1,
              },
              [indexToMove + 1]: {
                ...Object.values(actualToDoList)[indexToMove],
                orderValue: actualItem.orderValue,
              },
            };
          }
          return { ...state };
        case "toDo/check":
          return {
            ...state,
            [actualID]: { ...actualItem, checked: !actualItem.checked },
          };
        case "toDo/remove":
          delete actualToDoList[actualID];
          return { ...actualToDoList };
        case "toDo/edit":
          setTextToDo(actualItem.content);
          return {
            ...state,
            [actualID]: { ...actualItem, editting: true },
          };
        case "toDo/editSave":
          return {
            ...state,
            [actualID]: { ...actualItem, editting: false, content: textToDo },
          };
        case "toDo/editCancel":
          return {
            ...state,
            [actualID]: { ...actualItem, editting: false },
          };
        case "toDo/newSave":
          const OrderValueArray = Object.values(state).sort(
            (a, b) => a?.orderValue - b?.orderValue
          );
          return {
            ...state,
            [payload.newId]: {
              ...toDoDefault,
              id: payload.newId,
              content: textToDo,
              orderValue:
                OrderValueArray.length > 0
                  ? OrderValueArray[OrderValueArray.length - 1].orderValue + 1
                  : 1,
            },
          };
        default:
          return { ...state };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, toDoList);
  let ID_Count =
    Object.keys(state).length > 0
      ? Number(Object.keys(state)[Object.keys(state).length - 1])
      : 0;

  //#region Funções para o controle de estado
  const moveItem = (direction, id) => {
    dispatch({
      type: direction === "UP" ? "toDo/moveUp" : "toDo/moveDown",
      payload: { id: id },
    });
  };
  const checkItem = (id) => {
    dispatch({ type: "toDo/check", payload: { id: id } });
  };

  const removeItem = (id) => {
    dispatch({ type: "toDo/remove", payload: { id: id } });
  };

  const editItem = (id) => {
    setDisableMove(true);
    setDisableEdit(true);
    dispatch({ type: "toDo/edit", payload: { id: id } });
  };
  const saveEdit = (id) => {
    setDisableMove(false);
    setDisableEdit(false);
    dispatch({ type: "toDo/editSave", payload: { id: id } });
  };
  const cancelEdit = (id) => {
    setDisableMove(false);
    setDisableEdit(false);
    dispatch({ type: "toDo/editCancel", payload: { id: id } });
  };

  const newItem = () => {
    setNewItemAdded(true);
    setDisableEdit(true);
    setTextToDo("");
  };
  const saveNew = () => {
    ID_Count++;
    setNewItemAdded(false);
    setDisableEdit(false);
    dispatch({ type: "toDo/newSave", payload: { newId: ID_Count } });
  };
  const cancelNew = () => {
    setNewItemAdded(false);
    setDisableEdit(false);
  };
  //#endregion

  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        {Object.values(state)
          .sort((a, b) => a.orderValue - b.orderValue)
          .map((element) => {
            return !element.editting ? (
              <div
                key={element.id}
                style={{ margin: "8px", border: "1px solid", padding: "8px" }}
              >
                <ToDoItemPosControlStyled
                  id={element.id}
                  move={moveItem}
                  check={checkItem}
                  checkBox={element.checked}
                  disableMove={disableMove}
                />
                <ToDoItemContent
                  content={element.content}
                  order={element.orderValue}
                />
                <ToDoItemControl
                  id={element.id}
                  remove={removeItem}
                  edit={editItem}
                  disableEdit={disableEdit}
                />
              </div>
            ) : (
              <div
                key={element.id}
                style={{ margin: "8px", border: "1px solid", padding: "8px" }}
              >
                <ToDoItemChangeInput
                  order={element.orderValue}
                  text={textToDo}
                  handleOnChange={setTextToDo}
                />
                <ToDoItemInputControl
                  id={element.id}
                  save={saveEdit}
                  cancel={cancelEdit}
                  disableEdit={disableEdit}
                />
              </div>
            );
          })}
        {!newItemAdded ? (
          <ToDoItemAdd newItem={newItem} disableEdit={disableEdit} />
        ) : (
          <>
            <ToDoItemChangeInput text={textToDo} handleOnChange={setTextToDo} />
            <ToDoItemInputControl save={saveNew} cancel={cancelNew} />
          </>
        )}
      </div>
    </>
  );
}

const ToDoItemContent = ({ content, order }) => {
  return <p>{order + " " + content}</p>;
};

const ToDoItemPosControl = ({ id, move, check, checkBox, disableMove }) => {
  return (
    <>
      <Button
        color="blue"
        fontColor="white"
        onClick={() => move("UP", id)}
        disabled={disableMove}
      >
        ^
      </Button>
      <input type="checkbox" onChange={() => check(id)} checked={checkBox} />
      <Button
        color="blue"
        fontColor="white"
        onClick={() => move("DOWN", id)}
        disabled={disableMove}
      >
        v
      </Button>
    </>
  );
};

const ToDoItemControl = ({ id, remove, edit, disableEdit }) => {
  return (
    <>
      <Button onClick={() => edit(id)} disabled={disableEdit}>
        Edit
      </Button>
      <Button onClick={() => remove(id)}>Delete</Button>
    </>
  );
};

const ToDoItemAdd = ({ newItem, disableEdit }) => {
  return (
    <>
      <Button disabled={disableEdit} onClick={newItem}>
        +
      </Button>
    </>
  );
};

const ToDoItemChangeInput = ({ order, text, handleOnChange }) => {
  return (
    <>
      {order ? <p>{order}</p> : null}
      <input
        type="text"
        name="toDoText"
        value={text}
        onChange={(event) => handleOnChange(event.target.value)}
        placeholder="Insira seu texto aqui..."
      />
    </>
  );
};

const ToDoItemInputControl = ({ id, save, cancel }) => {
  return (
    <>
      <Button color="green" fontColor="white" onClick={() => save(id)}>
        Save
      </Button>
      <Button color="gray" fontColor="black" onClick={() => cancel(id)}>
        Cancel
      </Button>
    </>
  );
};

const Button = styled.button`
  background-color: ${({ color }) => color};
  color: ${({ fontColor }) => fontColor};
  font-size: 18px;
  justify-content: center;
  border: 1px solid;
  border-radius: 8px;
  padding: 8px;
  max-width: 100%;
`;

const ToDoItemPosControlStyled = styled(ToDoItemPosControl)`
  display: flex;
`;
