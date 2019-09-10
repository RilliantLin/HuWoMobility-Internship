import request from 'umi-request';
import { TableListParams } from './data';

export async function queryRule2(params: TableListParams) {
  return request('/api/client', {
    
    params,
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/removeClient', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/createClient', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/updateClient', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
