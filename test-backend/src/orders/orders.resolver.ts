import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { OrdersResponse } from '../graphql'
import { OrdersFilter } from '../retail_api/types'

@Resolver('Orders')
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query()
  async getOrders(@Args('page') page: number) {
    const filter: OrdersFilter = {
      page,
    }
    const data = await this.retailService.orders(filter)
    const response: OrdersResponse = {
      orders: data[0],
      pagination: data[1]
    }
    return response
  }

  @Query()
  async order(@Args('number') id: string) {
    return this.retailService.findOrder(id)
  }
}
