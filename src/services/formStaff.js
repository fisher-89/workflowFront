import request from '../utils/request';

export async function department(id) {
  return request(`/api/oa/departments/${id}/children-and-staff`);
}

export async function getStaff(id) {
  return request(`/api/oa/departments/${id}/staff`);
}

export async function firstDepartment(params) {
  return request('/api/staff', {
    method: 'GET',
    body: params,
  });
}

export async function getDepartment(params) {
  // const urlParams = url ? `?${url}` : '';
  return request('/api/department', {
    method: 'GET',
    body: params,
  });
}

export async function getShopList(params) {
  // const urlParams = url ? `?${url}` : '';
  return request('/api/shop', {
    method: 'GET',
    body: params,
  });
}


export async function serachStaff(search) {
  return request(`/api/oa/staff?${search}`, null, false);
}

export async function getFinalStaff() {
  return request('/api/event/final-staff', null, false);
}

