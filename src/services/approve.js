import request from '../utils/request';

// 审批详情
export function getStartFlow(id) {
  return request(`/api/approval/${id}`);
}
// 审批列表
export function getApproList(data) {
  return request('/api/approval', {
    method: 'GET',
    body: data,
  });
}
// 抄送列表
export function getCCList(data) {
  return request('/api/cc', {
    method: 'GET',
    body: data,
  });
}
export function getCCDetail(id) {
  return request(`/api/cc/${id}`);
}


// 审批同意
export function getThrough(data) {
  return request('/api/through', {
    method: 'PATCH',
    body: data.data,
  });
}
// 驳回
export function doReject(data) {
  return request('/api/reject', {
    method: 'PATCH',
    body: data,
  });
}
// 转交
export function doDeliver(data) {
  return request('/api/deliver', {
    method: 'POST',
    body: data,
  });
}
export function getFlowChart(id) {
  return request(`/api/flow-chart/${id}`, {
    method: 'GET',
  });
}
