import { makeAutoObservable } from "mobx";
import { OrdersListItem, OrderList } from "./types";
import { createBrowserHistory, History } from "history";
import client from "api/gql";
import { GET_ORDERS_QUERY } from "~/screens/Orders/List/queries";

export default class OrdersListState {
  initialized = false;
  loading = false;
  page = 1;
  totalPages = 1;
  orders: OrdersListItem[] = [];
  history: History;

  setInitialized(val: boolean) {
    this.initialized = val;
  }

  constructor() {
    makeAutoObservable(this);
    this.history = createBrowserHistory();
  }

  setOrders(orders: OrdersListItem[]): void {
    this.orders = orders;
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }

  setPage(page: number): void {
    this.page = page;
    const url = new URL(window.location.href);
    if (url.searchParams.get("page") !== this.page.toString()) {
      url.searchParams.set("page", "" + this.page);
      this.history.replace(url.pathname + url.search, {});
    }
  }

  nextPage(): void {
    if (this.page >= this.totalPages) return;
    this.setPage(this.page + 1);
    this.loading = true;
    this.loadOrders();
  }

  prevPage(): void {
    if (this.page <= 1) return;
    this.setPage(this.page - 1);
    this.loading = true;
    this.loadOrders();
  }

  setTotalPages(totalPages: number): void {
    this.totalPages = totalPages;
  }

  get canNext(): boolean {
    return this.page < this.totalPages;
  }

  get canPrev(): boolean {
    return this.page > 1;
  }

  async loadOrders() {
    try {
      this.startLoading();

      const searchParams = new URLSearchParams(window.location.search);
      const filters = [...searchParams].filter(item => item[0] === 'page');
      if (filters.length === 1) {
        const page = parseInt(filters[0][1]);
        if (!isNaN(page)) this.setPage(page)
      }
      const result =  await client
        .query(GET_ORDERS_QUERY, { page: this.page })
        .toPromise();
      
      const data: OrderList = result.data.getOrders;
      this.setOrders(data.orders);
      this.setTotalPages(data.pagination.totalPageCount);
    } catch (e) {
      console.error(e)
    } finally {
      this.stopLoading();
    }
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    this.loadOrders();
  }
}
