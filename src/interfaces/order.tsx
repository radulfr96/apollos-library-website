interface Order {
    orderId: number;
    businessId: number;
    orderDate: Date;
    orderItems: OrderItemListItem[];
}

export interface OrderItemListItem {
    bookId: number;
    title: string;
    isbn: string;
    eisbn: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export default Order;
