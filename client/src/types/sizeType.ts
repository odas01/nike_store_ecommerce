import { ListWithParams } from './listWithParamsType';

export interface ISize {
   _id: string;
   name: string;
   store: string;
   createdAt: Date;
}

export interface AllSizes extends ListWithParams {
   sizes: ISize[];
}

export type SizeFormValues = Omit<ISize, '_id' | 'createdAt'>;
