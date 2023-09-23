export abstract class Entity<T, K> {
  public readonly id: K;

  constructor(data: Omit<T, 'id'>, id?: K) {
    this.populate(data);
    this.id = id;
  }
  protected abstract populate(data: Omit<T, 'id'>);
}
