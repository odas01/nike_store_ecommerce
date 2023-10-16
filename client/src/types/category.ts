import { ListWithParams } from './listWithParams';

export interface ICategory {
   _id: string;
   name: string;
   store: string;
   status: string;
   createdAt: Date;
}

export interface AllCategories extends ListWithParams {
   categories: ICategory[];
}

export type CagtegoryFormValue = Omit<ICategory, '_id' | 'createdAt'>;
