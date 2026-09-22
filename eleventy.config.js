import markdownItImageFigures from "markdown-it-image-figures";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pseudocode from "./_languages/pseudocode.js";

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "assets/": "/" });
    eleventyConfig.addPassthroughCopy(
        "blog/**/*.{svg,png,jpg,jpeg,webp,gif,avif}",
    );

    eleventyConfig.addWatchTarget("./css/*.css");
    eleventyConfig.addWatchTarget("blog");

    eleventyConfig.addBundle("css", { bundleHtmlContentFromSelector: "style" });
    eleventyConfig.amendLibrary("md", (markdownLibrary) =>
        markdownLibrary.use(markdownItImageFigures, { figcaption: "alt" }),
    );
    eleventyConfig.addPlugin(syntaxHighlight, {
        init({ Prism }) {
            pseudocode(Prism);
        },
    });
    eleventyConfig.addShortcode("cite", function (...keys) {
        const bib = this.ctx.environments.bibliography;
        let links = keys.map((key) => {
            const index = bib.findIndex((ref) => ref.id === key);
            if (index == -1) {
                throw new Error(
                    `Unknown reference ${key} in ${this.page.inputPath}`,
                );
            }
            return `<a href="#ref-${key}">${index + 1}</a>`;
        });
        return `<cite>${links.join(" ")}</cite>`;
    });
}
