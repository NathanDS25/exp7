import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onToggleStatus, onEdit, onDelete, onToggleSubtask, onChangeStatus }) => {
  // We divide tasks into three columns matching the status enum
  const columns = {
    'Pending': tasks.filter(t => t.status === 'Pending'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Completed': tasks.filter(t => t.status === 'Completed')
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    // If dropped in the same column
    if (destination.droppableId === source.droppableId) return;

    // Trigger status update using the column id
    onChangeStatus(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="task-board">
        {Object.keys(columns).map((status) => (
          <div key={status} className="board-column glass-panel">
            <h3 className="board-column-header">
              {status} <span className="board-column-count">{columns[status].length}</span>
            </h3>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  className={`board-droppable-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columns[status].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`board-draggable-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <TaskCard
                            task={task}
                            onToggleStatus={onToggleStatus}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleSubtask={onToggleSubtask}
                            isBoardView={true}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
