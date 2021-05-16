import {Entity, model, property} from '@loopback/repository';

@model()
export class Pokemon extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  classification: string;

  @property.array(String)
  types?: string[];

  @property.array(String)
  resistant?: string[];

  @property.array(String)
  weaknesses?: string[];

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      title: 'Weight',
      properties: {
        minimum: {
          type: 'string',
        },
        maximum: {
          type: 'string',
        },
      },
    },
  })
  weight: {
    minimum: string;
    maximum: string;
  };

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      title: 'Height',
      properties: {
        minimum: {
          type: 'string',
        },
        maximum: {
          type: 'string',
        },
      },
    },
  })
  height: {
    minimum: string;
    maximum: string;
  };

  @property({
    type: 'number',
    required: true,
  })
  fleeRate: number;

  @property({
    type: 'any',
    required: true,
    jsonSchema: {
      title: 'Evoultion Requirment',
      properties: {
        amount: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
      },
    },
  })
  evolutionRequirements: {
    amount: number;
    name: string;
  };

  @property.array(Object, {
    jsonSchema: {
      title: 'Evolutions',
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
      },
    },
  })
  evolutions: {
    id: number;
    name: string;
  }[];

  @property({
    type: 'number',
    required: true,
  })
  maxCP: number;

  @property({
    type: 'number',
    required: true,
  })
  maxHP: number;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      title: 'Attacks',
      properties: {
        fast: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              damage: {
                type: 'number',
              },
            },
          },
        },
        special: {
          type: 'array',
          items: {
            properties: {
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              damage: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  })
  attacks: {
    fast: {
      name: string;
      type: string;
      damage: number;
    }[];
    special: {
      name: string;
      type: string;
      damage: number;
    }[];
  };

  constructor(data?: Partial<Pokemon>) {
    super(data);
  }
}
