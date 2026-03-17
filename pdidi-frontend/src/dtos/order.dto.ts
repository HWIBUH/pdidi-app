import type { Menu } from "@/model/menu.model";
import type { User } from "@/model/user.model";

export interface OrderResponse {
    id: number,
    user_id: number,
    menu_id: number,
    done: boolean,
    total_price: number,
    createdAt: Date,
    updatedAt: Date,
    user?: User,
    menu?: Menu
}

export interface OrderRequest {
    user_id: number,
    menu_id: number,
    total_price: number
}