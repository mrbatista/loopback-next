import {Entity, model, property} from '@loopback/repository';
import {Warehouse} from './warehouse.model';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLenght: 5,
      uniqueness: {repository: 'ProductRepository'},
    }
  })
  name: string;

  @property({
    type: 'string',
    default: new Date(),
    jsonSchema: {
      formats: ['date'],
    }
  })
  created: Date;

  @property({
    type: Warehouse,
  })
  warehouse: Warehouse;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
