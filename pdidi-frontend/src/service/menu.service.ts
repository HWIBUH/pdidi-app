import type { Menu } from "@/model/menu.model";

export function order() {

}

export async function getAllMenus():Promise<Menu[]> {

    const dummy:Menu[] = [
        {
            name: "Ayam Cabe Garam",
            popularity: 100,
            price: 230000
        }
    ]
    return dummy
}