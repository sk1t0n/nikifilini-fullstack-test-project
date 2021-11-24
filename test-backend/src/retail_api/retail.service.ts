import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'
import { fetchDataByUrl } from './utils'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance
  private readonly apiUrl = `${process.env.RETAIL_URL}/api/v5`
  private readonly apiKeyParam = `apiKey=${process.env.RETAIL_KEY}`
  private readonly siteParam = `site=${process.env.SITE}`

  constructor() {
    this.axios = axios.create({
      baseURL: this.apiUrl,
      timeout: 10000,
      headers: { },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = `${serialize(filter, '')}&${this.apiKeyParam}`
    const resp = await this.axios.get(`/orders?${params}`)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrder(id: string): Promise<Order | null> {
    const url = `/orders/${id}?${this.apiKeyParam}&${this.siteParam}`
    const resp = await this.axios.get(url)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const order = plainToClass(Order, resp.data.order)
    return order
  }

  async orderStatuses(): Promise<CrmType[]> {
    const url = `/reference/statuses?${this.apiKeyParam}`
    return await fetchDataByUrl(this.axios, url, 'statuses')
  }

  async productStatuses(): Promise<CrmType[]> {
    const url = `/reference/product-statuses?${this.apiKeyParam}`
    return await fetchDataByUrl(this.axios, url, 'productStatuses')
  }

  async deliveryTypes(): Promise<CrmType[]> {
    const url = `/reference/delivery-types?${this.apiKeyParam}`
    return await fetchDataByUrl(this.axios, url, 'deliveryTypes')
  }
}
