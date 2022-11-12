export class PaginatedCollection<T> {
    public items: T[];
    public pageNumber?: number;
    public totalItems?: number;
}