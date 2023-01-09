export interface InventoryProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface User
{
    id: number;
    username: string;
    level: number;
    password?: string;
    updateAt?: string;
    email: string;
    createdAt: string;
    teams?: string[];
    number: string;
    avatar: string;
}

export interface UserPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface UserCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface UserTag
{
    id?: string;
    title?: string;
}
