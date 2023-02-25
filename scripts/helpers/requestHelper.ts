import axios from 'axios'

export const requestHelper = (url: string, from: string, apiId: string, params: any[], to: string, gasLimit: string, signatureType: string) => {
  const data = {
    from,
    apiId,
    params,
    to,
    gasLimit,
    signatureType,
  }

  const config = {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
      'Content-Type': 'application/json',
    },
  }

  return axios.post(url, JSON.stringify(data), config)
}
