import request from '../utils/request';

// 审批详情
export function getStartFlow(data) {
  return request(`/api/approval/${data.flow_id}`);
}
// 审批列表
export function getApproList(data) {
  return request('/api/approval', {
    method: 'GET',
    body: data,
  });
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

