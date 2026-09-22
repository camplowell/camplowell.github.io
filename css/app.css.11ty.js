import path from "node:path";
import { bundle } from "lightningcss";

export const data = {
  permalink: "/css/app.css",
};

export function render() {
  const { code } = bundle({
    filename: path.join(import.meta.dirname, "app.css"),
    minify: true,
  });
  return code.toString();
}