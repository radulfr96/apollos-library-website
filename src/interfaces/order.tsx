interface Order {
    orderId: number;
    bookshopId: number;
    orderDate: Date;
    orderItems: OrderItem[];
}

export interface OrderItem {
    bookId: number;
    quantity: number;
    price: number;
}

export default Order;
