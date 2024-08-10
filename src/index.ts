import express from "express";
export const app = express();
export const port = 2222;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
