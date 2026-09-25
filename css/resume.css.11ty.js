import path from "node:path";
import { bundle } from "lightningcss";

export const data = {
  permalink: "/css/resume.css",
};

export function render() {
  const { code } = bundle({
    filename: path.join(import.meta.dirname, "resume.css"),
    minify: true,
  });
  return code.toString();
}
