import request from '../utils/request';

export async function department(id) {
  return request(`/api/oa/departments/${id}/children-and-staff`);
}

export async function getStaff(id) {
  return request(`/api/oa/departments/${id}/staff`);
}
export async function firstDepartment() {
  return request('/api/oa/departments?filters=parent_id=0');
}

export async function serachStaff(search) {
  return request(`/api/oa/staff?${search}`, null, false);
}
export async function getFinalStaff() {
  return request('/api/event/final-staff', null, false);
}

