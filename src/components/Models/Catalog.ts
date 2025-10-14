import { IProduct } from '../../types';

export class Catalog {
  protected items: IProduct[] = [];
  protected previewItem?: IProduct;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setPreviewItem(item: IProduct): void {
    this.previewItem = item;
  }

  getPreviewItem(): IProduct | undefined {
    return this.previewItem;
  }
}
