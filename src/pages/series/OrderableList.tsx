/* eslint-disable react/jsx-props-no-spreading */
import {
    Card, Grid, Paper, Typography,
} from '@mui/material';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SeriesBookItem from '../../interfaces/seriesBookItem';

interface OrderableListProps {
    onDragEnd: (result: any) => void;
    items: Array<SeriesBookItem>;
}

const OrderableList = (props: OrderableListProps) => {
    const { onDragEnd, items } = props;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="bookList">
                {(provided: any) => (
                    <Paper
                        sx={{
                            height: '100%',
                            padding: '5px',
                            backgroundColor: '#EEEEEE',
                        }}
                    >
                        {items.map((item: SeriesBookItem, index: number) => (
                            <Draggable key={item.bookId} draggableId={item.bookId === undefined ? '' : item.bookId.toString()} index={index}>
                                {(providedCard: any) => (
                                    <Card
                                        ref={provided.innerRef}
                                        {...providedCard.draggableProps}
                                        {...providedCard.dragHandleProps}
                                        variant="outlined"
                                        sx={{
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={2} />
                                                <Grid item xs={10}>
                                                    <Typography variant="body1">
                                                        {item.title}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Paper>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default OrderableList;
