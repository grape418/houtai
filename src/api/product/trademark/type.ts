export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface TradeMack{
  id?: number
  tmName: string
  logoUrl: string
}

export type Records = TradeMack[]

export interface TradeMackResponseData extends ResponseData{
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}