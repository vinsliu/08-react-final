import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: { comments: [] },
  reducers: {
    addComment: (state, action) => {
      state.comments.push({
        id: Date.now(),
        text: action.payload.text,
        note: action.payload.note,
        termsAccepted: false,
      });
    },
    deleteComment: (state, action) => {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload
      );
      if (comment) comment.termsAccepted = !comment.termsAccepted;
    },
  },
});

export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
