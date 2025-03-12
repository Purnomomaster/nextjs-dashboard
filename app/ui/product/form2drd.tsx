import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { nanoid } from 'nanoid';

const elements = [
  { type: 'text', label: 'Text Input' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'select', label: 'Dropdown' },
];

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);

  const handleDrop = (item) => {
    setFormElements([...formElements, { id: nanoid(), ...item }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 p-4">
        <div className="w-1/3 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Elements</h2>
          {elements.map((el) => (
            <DraggableElement key={el.type} element={el} />
          ))}
        </div>
        <DropZone onDrop={handleDrop} formElements={formElements} />
      </div>
    </DndProvider>
  );
};

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_ELEMENT',
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`mb-2 cursor-pointer rounded border bg-white p-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      {element.label}
    </div>
  );
};

const DropZone = ({ onDrop, formElements }) => {
  const [, drop] = useDrop(() => ({
    accept: 'FORM_ELEMENT',
    drop: (item) => onDrop(item),
  }));

  return (
    <div
      ref={drop}
      className="min-h-[300px] w-2/3 rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-4"
    >
      <h2 className="text-lg font-bold">Drop Here</h2>
      {formElements.map((el) => (
        <div key={el.id} className="mb-2 rounded border bg-white p-2">
          {el.label}
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;
