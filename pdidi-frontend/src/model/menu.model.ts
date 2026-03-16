import { getAllMenus } from "@/service/menu.service"

export type Menu = {
    name: string,
    price: number,
    popularity: number
}

export const menus:Menu[] = await getAllMenus()