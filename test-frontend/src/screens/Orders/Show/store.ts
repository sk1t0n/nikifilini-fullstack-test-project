import { makeAutoObservable } from "mobx";
import { SingleOrder } from "~/screens/Orders/Show/types";
import { ORDER_QUERY } from './queries';
import client from "api/gql";
import { cons } from "fp-ts/lib/ReadonlyNonEmptyArray";

export default class OrdersShowStore {
  order: SingleOrder | null = null;
  id: string | null = null;
  initialized = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setOrder(order: SingleOrder): void {
    this.order = order;
  }
  
  setId(id: string) {
    this.id = id;
  }

  setInitialized(val: boolean) {
    this.initialized = val;
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }

  async loadOrder() {
    try {
      this.startLoading();

      const id = window.location.pathname.split('/')[2];
      this.setId(id);
      const result =  await client
        .query(ORDER_QUERY, { number: id })
        .toPromise();
      
      const order: SingleOrder = result.data.order;
      this.setOrder(order);
    } catch (e) {
      console.error(e)
    } finally {
      this.stopLoading();
    }
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    this.loadOrder();
  }
}
