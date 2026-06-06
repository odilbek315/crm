export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'relation' | 'enum';

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for enum
  relationTo?: string; // for relation
}

export interface CustomEntity {
  id: string;
  tenantId: string;
  name: string;
  tableName: string;
  fields: CustomField[];
  createdAt: string;
}

/**
 * Custom Module & Schema Builder
 * Allows tenants to define new entities at runtime dynamically.
 */
class SchemaBuilderService {
  private schemas: Map<string, CustomEntity> = new Map();

  createEntity(tenantId: string, name: string, fields: CustomField[]): CustomEntity {
    const entity: CustomEntity = {
      id: crypto.randomUUID(),
      tenantId,
      name,
      tableName: `custom_${tenantId.replace(/-/g, '_')}_${name.toLowerCase().replace(/\s/g, '_')}`,
      fields,
      createdAt: new Date().toISOString()
    };
    
    this.schemas.set(entity.id, entity);
    console.log(`[SchemaBuilder] Generated custom entity schema: ${entity.name} -> ${entity.tableName}`);
    
    // In a real system, this would trigger a Prisma schema update or a virtual schema evolution.
    return entity;
  }

  getEntities(tenantId: string): CustomEntity[] {
    return Array.from(this.schemas.values()).filter(s => s.tenantId === tenantId);
  }
}

export const SchemaBuilder = new SchemaBuilderService();
