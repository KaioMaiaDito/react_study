import { useReducer, useState, useRef } from "react";

//Usar useRef na hora de digitar o conteúdo do ToDo para não ficar consumindo memória com o onChange
//Transformar o ToDoListArray em um Objeto de Objetos
//Mudar os comandos do dispatch para o tipo {type: ... payload: {}}
//Alterar a ordenação usando o sort e o orderValue.

let IDNUMBER = 3;
export default function ToDo() {
  const editRef = useRef("");

  const toDoListArray = [
    {
      id: 0,
      content: "Teste 1",
      orderValue: 0,
      delete: false,
      checked: false,
      editting: false,
    },
    {
      id: 1,
      content: "Teste 2",
      orderValue: 1,
      delete: false,
      checked: true,
      editting: false,
    },
    {
      id: 2,
      content: "Teste 3",
      orderValue: 2,
      delete: false,
      checked: false,
      editting: false,
    },
  ];

  const toDoItemInitial = {
    id: null,
    content: "",
    orderValue: null,
    delete: false,
    checked: false,
    editting: false,
  };

  const reducerElement = {
    actualCommand: "",
    id: null,
    text: "",
    toDoList: toDoListArray,
  };

  const reducer = (state, action) => {
    if (action.toDoList !== undefined) {
      const index = state.toDoList.findIndex(
        (element) => element.id === action.id
      );
      switch (action.actualCommand) {
        case "MoveUp": {
          if (index === 0) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          const actualToDoItem = actualToDoList[index];
          const beforeToDoItem = actualToDoList[index - 1];
          actualToDoList.splice(index, 1, {
            ...beforeToDoItem,
            orderValue: actualToDoList[index].orderValue,
          });
          actualToDoList.splice(index - 1, 1, {
            ...actualToDoItem,
            orderValue: actualToDoList[index - 1].orderValue,
          });
          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "MoveDown": {
          if (index === state.toDoList.length - 1) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          const actualToDoItem = actualToDoList[index];
          const afterToDoItem = actualToDoList[index + 1];
          actualToDoList.splice(index, 1, {
            ...afterToDoItem,
            orderValue: actualToDoList[index].orderValue,
          });
          actualToDoList.splice(index + 1, 1, {
            ...actualToDoItem,
            orderValue: actualToDoList[index + 1].orderValue,
          });
          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "Check": {
          const actualToDoList = [...state.toDoList];
          const checkedToDoItem = actualToDoList[index];
          actualToDoList.splice(index, 1, {
            ...checkedToDoItem,
            checked: !actualToDoList[index].checked,
          });
          return {
            ...state,
            actualCommand: "",
            toDoList: actualToDoList,
          };
        }
        case "AddToDoBlank": {
          const actualToDoList = [...state.toDoList];
          const newToDoItem = actualToDoList.concat(toDoItemInitial);
          return {
            ...state,
            actualCommand: "AddToDoBlank",
            toDoList: newToDoItem,
          };
        }
        case "CancelNew": {
          const actualToDoList = [...state.toDoList];
          actualToDoList.pop();
          return {
            ...state,
            actualCommand: "",
            toDoList: actualToDoList,
          };
        }
        case "CancelEdit": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = { ...actualToDoList[index], editting: false };
          return {
            ...state,
            toDoList: actualToDoList,
          };
        }
        case "SaveToDo": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[actualToDoList.length - 1] = {
            id: IDNUMBER,
            content: action.text,
            orderValue: actualToDoList.length - 1,
            delete: false,
            checked: false,
            editting: false,
          };
          IDNUMBER++; //Mudar depois!!
          return {
            ...state,
            actualCommand: "",
            text: "",
            toDoList: actualToDoList,
          };
        }
        case "RemoveToDoItem": {
          const actualToDoList = [...state.toDoList];
          actualToDoList.splice(index, 1);
          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "EditToDo": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = { ...actualToDoList[index], editting: true };
          return {
            ...state,
            actualCommand: "",
            text: "",
            toDoList: actualToDoList,
          };
        }
        case "SaveEditToDo": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = {
            id: action.toDoList[index].id,
            content: action.text,
            orderValue: state.toDoList[index].orderValue,
            delete: false,
            checked: false,
            editting: false,
          };

          return {
            ...state,
            actualCommand: "",
            text: "",
            toDoList: actualToDoList,
          };
        }
        default:
          break;
      }
    }
    return { ...state };
  };

  const [state, dispatch] = useReducer(reducer, reducerElement);
  const [textToDo, setTextToDo] = useState(toDoItemInitial.content);

  const moveToDo = (direction, id) => {
    if (direction === "UP") {
      dispatch({ ...state, id: id, actualCommand: "MoveUp" });
    }
    if (direction === "DOWN") {
      dispatch({ ...state, id: id, actualCommand: "MoveDown" });
    }
    return;
  };
  const checkToDo = (id) => {
    dispatch({ ...state, id: id, actualCommand: "Check" });
    return;
  };
  const editToDo = (id) => {
    const index = state.toDoList.findIndex((element) => element.id === id);
    setTextToDo(String(state.toDoList[index].content));

    dispatch({ ...state, id: id, actualCommand: "EditToDo" });
    return;
  };
  const addToDo = () => {
    dispatch({ ...state, actualCommand: "AddToDoBlank" });
    return;
  };
  const cancelNewToDo = () => {
    dispatch({ ...state, actualCommand: "CancelNew" });
    setTextToDo("");
    return;
  };
  const cancelEditToDo = (id) => {
    dispatch({ ...state, id: id, actualCommand: "CancelEdit" });
    return;
  };
  const removeToDo = (id) => {
    dispatch({ ...state, id: id, actualCommand: "RemoveToDoItem" });
    return;
  };
  const saveToDo = (text) => {
    dispatch({ ...state, text: text, actualCommand: "SaveToDo" });
    setTextToDo("");
    return;
  };
  const saveEditToDo = (id, text) => {
    dispatch({ ...state, id: id, text: text, actualCommand: "SaveEditToDo" });
    setTextToDo("");

    return;
  };

  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        <p>ToDoContainer</p>
        <ToDoItem
          toDoList={state.toDoList}
          moveToDo={moveToDo}
          checkToDo={checkToDo}
          removeToDo={removeToDo}
          editToDo={editToDo}
          saveEditToDo={saveEditToDo}
          cancelEditToDo={cancelEditToDo}
          editRef={editRef}
          value={textToDo}
        />
        {state.actualCommand === "AddToDoBlank" && (
          <AddedToDoItem
            onChange={() => {
              setTextToDo(editRef.current);
            }}
            save={saveToDo}
            cancel={cancelNewToDo}
          />
        )}
        {state.actualCommand !== "AddToDoBlank" && (
          <button onClick={() => addToDo()}>+</button>
        )}
      </div>
    </>
  );
}

const AddedToDoItem = ({ save, cancel }) => {
  const addRef = useRef("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(addRef.current);
      }}
      style={{ margin: "8px", border: "1px solid", padding: "8px" }}
    >
      <label>
        <input
          type="text"
          name="toDoText"
          ref={addRef}
          placeholder="Insira seu texto aqui..."
        />
      </label>
      <button type="submit">SAVE</button>
      <button type="button" onClick={() => cancel()}>
        CANCEL
      </button>
    </form>
  );
};

const ToDoItem = ({
  toDoList,
  moveToDo,
  checkToDo,
  removeToDo,
  editToDo,
  saveEditToDo,
  cancelEditToDo,
  value,
  editRef,
}) => {
  return toDoList.map((element) => {
    return element.id !== null ? (
      <div
        key={element.id}
        style={{ margin: "8px", border: "1px solid", padding: "8px" }}
      >
        <button onClick={() => moveToDo("UP", element.id)}>^</button>
        <input
          type="checkbox"
          onChange={() => checkToDo(element.id)}
          checked={element.checked}
        />
        <button onClick={() => moveToDo("DOWN", element.id)}>v</button>
        {element.editting ? (
          <input
            type="text"
            ref={editRef}
            name="toDoText"
            placeholder="Insira seu texto aqui..."
          />
        ) : (
          <p>{element.content}</p>
        )}
        {element.editting ? (
          <button onClick={() => saveEditToDo(element.id, value)}>EDIT</button>
        ) : (
          <button onClick={() => editToDo(element.id)}>Edit</button>
        )}

        {element.editting ? (
          <button type="button" onClick={() => cancelEditToDo(element.id)}>
            CANCEL
          </button>
        ) : (
          <button onClick={() => removeToDo(element.id)}>X</button>
        )}
      </div>
    ) : null;
  });
};
