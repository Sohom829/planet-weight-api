import app from "./api/app";
let PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
