export interface DynamicModel<T> {
  create?(data: any): Promise<T>;
  findUnique?(data: any): Promise<T | null>;
  findMany?(data: any): Promise<T[]>;
  update?(data: any): Promise<T>;
  count?(data: any): Promise<number>;
  findFirst?(data: any): Promise<T | null>;
}
