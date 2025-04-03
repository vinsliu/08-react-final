import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: { comments: [] },
  reducers: {
    addComment: (state, action) => {
      state.comments.push({
        id: Date.now(),
        comment: action.payload.comment,
        note: action.payload.note,
        acceptConditions: false,
      });
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );
    },
  },
});

export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
