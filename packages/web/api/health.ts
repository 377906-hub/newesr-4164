export default {
  fetch() {
    return Response.json({
      status: "ok",
      source: "vercel-function",
    });
  },
};