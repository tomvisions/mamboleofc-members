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

export interface Gallery
{
    id: string;
    name: string;
    updateAt?: string;
    createdAt: string;
}

export interface Image
{
    id: string;
    file: string;
    updateAt?: string;
    createdAt: string;
}

export interface ImagePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
export interface GalleryPagination
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
