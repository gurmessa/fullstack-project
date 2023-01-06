export type Feedback = {
  pk: number
  comment: string | null
}

export type Essay = {
  pk: number
  name: string
  content: string
  revision_of: number | null
  feedback: Feedback | null
}

export type FeedbackRequest = {
  pk: number
  essay: Essay
}

export type FeedbackDetailState = {
  currentFeedbackRequest: FeedbackRequest | null
  perviousEssays: Array<Essay>
}
