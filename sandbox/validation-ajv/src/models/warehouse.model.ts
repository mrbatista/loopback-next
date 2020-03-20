import {model, Model, property} from '@loopback/repository';

@model()
export class Warehouse extends Model {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 5
    }
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<Warehouse>) {
    super(data);
  }
}

export interface WarehouseRelations {
  // describe navigational properties here
}

export type WarehouseWithRelations = Warehouse & WarehouseRelations;
