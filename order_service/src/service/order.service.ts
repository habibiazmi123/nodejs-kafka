import { OrderLineItemType, OrderWithLineItems } from './../dto/orderRequest.dto';
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { MessageType, OrderStatus } from '../types';

export const CreateOrder = async (
    userId: number,
    repo: OrderRepositoryType,
    cartRepo: CartRepositoryType
) => {
    const cart = await cartRepo.findCart(userId);
    if (!cart) {
        throw new Error("Cart not found");
    }

    let cartTotal = 0;
    let orderLineItems: OrderLineItemType[] = [];

    cart.lineItems.forEach((item) => {
        cartTotal += item.qty * Number(item.price);
        orderLineItems.push({
            productId: item.productId,
            itemName: item.itemName,
            qty: item.qty,
            price: item.price
        } as OrderLineItemType);
    })

    const orderNumber = Math.floor(Math.random() * 1000000);
    const orderInput: OrderWithLineItems = {
        orderNumber: orderNumber,
        txnId: null,
        status: OrderStatus.PENDING,
        customerId: userId,
        amount: cartTotal.toString(),
        orderItems: orderLineItems
    }

    const order = await repo.createOrder(orderInput);
    await cartRepo.clearCartData(userId);

    return { message: "Order created successfully", orderId: orderNumber };
}

export const UpdateOrder = async (
    orderId: number,
    status: OrderStatus,
    repo: OrderRepositoryType,
) => {
    await repo.updateOrder(orderId, status);

    if (status === OrderStatus.CANCELLED) {

    }

    return { message: "Order updated successfully" };
}

export const GetOrder = (orderId: number, repo: OrderRepositoryType) => {
    const order = repo.findOrder(orderId);
    if (!order) {
        throw new Error("Order not found")
    }
    return order;
}

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
    const orders = await repo.findOrdersByCustomerId(userId);
    if (!Array.isArray(orders)) {
        throw new Error("Order not found")
    }
    return orders;
}

export const DeleteOrder = async (orderId: number, repo: OrderRepositoryType) => {
    await repo.deleteOrder(orderId);
    return true;
}

export const HandleSubscription = async (message: MessageType) => {
    console.log("Message received by order Kafka consumer", message);
}