import { ListWithParams } from './listWithParamsType';

export interface ICategory {
   _id: string;
   name: string;
   vnName: string;
   store: 'shoes' | 'clothing' | 'gear';
   status: string;
   createdAt: Date;
}

export interface AllCategories extends ListWithParams {
   categories: ICategory[];
}

export type CagtegoryFormValue = Omit<ICategory, '_id' | 'createdAt'>;
