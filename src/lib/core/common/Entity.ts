/**
 * Universal Entity Framework - Core Classes
 */

export interface IEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity implements IEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IEntity>) {
    this.id = data.id || crypto.randomUUID();
    this.tenantId = data.tenantId || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

/**
 * Base Repository Interface for PostgreSQL Data Access Layer pattern
 */
export interface IRepository<T extends IEntity> {
  findById(id: string, tenantId: string): Promise<T | null>;
  findAll(tenantId: string, filter?: any, pagination?: any): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, tenantId: string, entity: Partial<T>): Promise<T>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export abstract class BaseService<T extends IEntity> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  async getById(id: string, tenantId: string): Promise<T | null> {
    // Audit hook could go here
    return this.repository.findById(id, tenantId);
  }

  async getAll(tenantId: string, filter?: any): Promise<T[]> {
    return this.repository.findAll(tenantId, filter);
  }

  async create(data: any, tenantId: string, userId: string): Promise<T> {
    const draft = { ...data, tenantId };
    const entity = await this.repository.create(draft);
    return entity;
  }
}
