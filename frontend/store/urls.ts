export const Urls = {
  Login: () => '/login/',
  Logout: () => '/logout/',
  User: () => '/api/user/',
  FeedbackRequest: () => '/api/feedback-request/',
  FeedbackRequestDetail: (pk: string) => `/api/feedback-request/${pk}/detail`,
  ReturnFeedback: (pk: string) => `/api/feedback-request/${pk}/return`,
  PickupFeedbackRequest: () => '/api/feedback-request/pickup',
}


