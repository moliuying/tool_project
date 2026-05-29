export declare class Menu {
    id: number;
    name: string;
    path: string;
    icon: string;
    parentId: number;
    sort: number;
    component: string;
    createdAt: Date;
    updatedAt: Date;
    parent: Menu;
    children: Menu[];
}
