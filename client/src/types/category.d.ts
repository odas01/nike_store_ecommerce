import { Message, ListWithParams } from '.';

export interface ICategory {
   _id: string;
   name: string;
   vnName: string;
   store: string;
   status: string;
   createdAt: Date;
}

export interface AllCategories extends ListWithParams {
   categories: ICategory[];
}

export type CagtegoryFormValue = Omit<ICategory, '_id' | 'createdAt'>;

export interface CategoryResponse {
   category: ICategory;
   message: Message;
}
