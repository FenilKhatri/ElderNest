/** Unwrap axios interceptor payload ({ success, message, data }) */
export const apiPayload = (res) => res?.data ?? res;

export const apiStage = (res) => {
  const payload = apiPayload(res);
  return payload?.stage ?? res?.stage ?? null;
};

export const apiCaregiver = (res) => {
  const payload = apiPayload(res);
  return payload?.caregiver ?? res?.caregiver ?? null;
};

export const uploadUrlFromResponse = (res) =>
  res?.data?.url ?? res?.url ?? res?.data?.data?.url ?? null;
