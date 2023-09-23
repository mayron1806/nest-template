export abstract class EntityWithoutId<T> {
  constructor(data: Omit<T, ''>) {
    this.populate(data);
  }
  protected abstract populate(data: Omit<T, ''>);
}
