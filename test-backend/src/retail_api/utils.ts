import { AxiosInstance } from 'axios'
import { plainToClass } from 'class-transformer'
import { CrmType } from './types'

/**
 * Returns data from the API by url
 * @param {AxiosInstance} axios - instance of the axios
 * @param {string} url - API url
 * @param {string} mainKey - object property name to access main data
 */
export const fetchDataByUrl = async (
  axios: AxiosInstance,
  url: string,
  mainKey: string
): Promise<CrmType[]> => {
  const resp = await axios.get(url)

  if (!resp.data) throw new Error('RETAIL CRM ERROR')

  const entries = Object.entries(resp.data[mainKey])
  let statuses: CrmType[] = entries.map(entry => entry[1]) as Array<any>
  statuses = plainToClass(CrmType, statuses)
  return statuses
}
