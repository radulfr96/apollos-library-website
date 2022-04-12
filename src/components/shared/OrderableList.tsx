import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

interface OrderableListProps {
    onDragEnd: (result: any) => void;
}

const OrderableList = (props: OrderableListProps) => {
    const { onDragEnd } = props;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" />
        </DragDropContext>
    );
};

export default OrderableList;
