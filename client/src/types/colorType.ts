import { ListWithParams } from './listWithParamsType';

export interface IColor {
   _id: string;
   name: string;
   vnName: string;
   value: string;
   createdAt: Date;
}

export interface AllColors extends ListWithParams {
   colors: IColor[];
}

export type ColorFormValues = Omit<IColor, '_id' | 'createdAt'>;
