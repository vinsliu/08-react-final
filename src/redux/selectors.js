export const selectComment = (state) => state.comments;

export const selectAcceptedComments = (state) =>
  state.comments.filter((comment) => comment.termAccepted);
