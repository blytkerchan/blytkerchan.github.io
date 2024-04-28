const fs = require("fs");
const marked = require("marked");

const { globSync } = require("glob");
const URL = require("url").URL;

function removePrefix(str, prefix) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  } else {
    return str;
  }
}

class BuildPosts {
  static defaultOptions = {
    indexFile: "_posts/index.json",
    feedFile: "feed.xml",
    configFile: "package.json",
  };

  constructor(options = {}) {
    this.options = { ...BuildPosts.defaultOptions, ...options };
    this.posts = {};

    let configFileName = this.options.configFile;
    if (configFileName[0] !== "/") {
      configFileName =
        this.options.paths.appPath +
        (this.options.paths.appPath[this.options.paths.appPath.length - 1] === "/" ? "" : "/") +
        configFileName;
    }
    this.config = JSON.parse(fs.readFileSync(configFileName))["blog"];
    if (!Object.keys(this.config).includes("useHashRouting")) {
      this.config["useHashRouting"] = false;
    }
  }

  fromMarkdown(markdown) {
    const html = marked.parse(markdown);
    return html;
  }

  parseInputMarkdown(filename) {
    const fileContents = fs.readFileSync(filename);
    const fileContentsStr = fileContents.toString();
    const fileLines = fileContentsStr.split("\n");

    const ParserState = Object.freeze({
      INITIAL: 0,
      PARSING_METADATA: 1,
      PARSING_MULTI_LINE_VALUE: 2,
      PARSING_ARRAY: 3,
      PARSING_BODY: 4,
      DONE: 5,
      ERROR: 6,
    });
    var nonEmptyLineSeen = false;
    var parserState = ParserState.INITIAL;
    var parsingValueName = "";
    var parsingValue;
    var post = {};
    var moreMarkerFound = false;

    fileLines.forEach((line) => {
      if (parserState === ParserState.PARSING_BODY || line.length > 0) {
        const startsWithWhiteSpace = line !== line.trimStart();
        if (!startsWithWhiteSpace && parserState === ParserState.PARSING_MULTI_LINE_VALUE) {
          post[parsingValueName] = parsingValue.join("\n");
          parserState = ParserState.PARSING_METADATA;
        } else if (!line.trimStart().startsWith("- ") && parserState === ParserState.PARSING_ARRAY) {
          post[parsingValueName] = parsingValue;
          parserState = ParserState.PARSING_METADATA;
        }
        switch (parserState) {
          default:
          case ParserState.INITIAL:
            if (!nonEmptyLineSeen && line.trimEnd() === "---") {
              parserState = ParserState.PARSING_METADATA;
            }
            break;
          case ParserState.PARSING_METADATA:
            if (line.trimEnd() === "---") {
              parserState = ParserState.PARSING_BODY;
            } else if (!startsWithWhiteSpace) {
              const colonIndex = line.indexOf(":");
              if (colonIndex < 0) {
                parserState = ParserState.ERROR;
              } else {
                parsingValueName = line.slice(0, colonIndex).trim();
                parsingValue = line.slice(colonIndex + 1).trim();
                if (parsingValue === "|") {
                  parserState = ParserState.PARSING_MULTI_LINE_VALUE;
                  parsingValue = [];
                } else if (parsingValue.length === 0) {
                  parserState = ParserState.PARSING_ARRAY;
                  parsingValue = [];
                } else {
                  post[parsingValueName] = parsingValue;
                }
              }
            } else {
              parserState = ParserState.ERROR;
            }
            break;
          case ParserState.PARSING_MULTI_LINE_VALUE:
            line = line.trim();
            parsingValue.push(line);
            break;
          case ParserState.PARSING_ARRAY:
            line = line.trimStart().slice(2);
            line = line.trim();
            parsingValue.push(line);
            break;
          case ParserState.PARSING_BODY:
            if (!Object.keys(post).includes("body")) {
              post["body"] = [];
            }
            if (line.includes("<!--more-->") && !Object.keys(post).includes("excerpt") && !moreMarkerFound) {
              const finalLine = line.slice(0, line.indexOf("<!--more-->"));
              post["excerpt"] = post["body"].join("\n") + finalLine;
              moreMarkerFound = true;
            }
            post["body"].push(line);
        }
        nonEmptyLineSeen = true;
      }
    });
    if (parserState !== ParserState.ERROR) {
      let fromDirName = this.options.from;
      if (fromDirName[0] !== "/") {
        fromDirName =
          this.options.paths.appPath +
          (this.options.paths.appPath[this.options.paths.appPath.length - 1] === "/" ? "" : "/") +
          fromDirName;
      }
      if (fromDirName[fromDirName.length - 1] !== "/") {
        fromDirName += "/";
      }
      post["filename"] = removePrefix(filename, fromDirName);
      if (!Object.keys(post).includes["date"]) {
        const re = /^([0-9]{4})-?([0-9]{2})-?([0-9]{2})/;
        const found = post["filename"].match(re);
        post["date"] = new Date(Date.parse(`${found[1]}-${found[2]}-${found[3]}`)).toISOString();
      }
      if (!Object.keys(post).includes("slug")) {
        const re = /^([0-9]{4})-?([0-9]{2})-?([0-9]{2})/;
        const found = post["filename"].match(re);
        post["slug"] = removePrefix(post["filename"], `${found[0]}-`).toLowerCase();
        post["slug"] = post["slug"].slice(0, post["slug"].indexOf("."));
      }
      post["body"] = post["body"].join("\n");
      if (!Object.keys(post).includes("excerpt")) {
        post["excerpt"] = post["body"];
      }
      if (!Object.keys(post).includes("permalink")) {
        const re = /([0-9]{4})-?([0-9]{2})-?([0-9]{2})/;
        const found = post["filename"].match(re);
        var publicUrl = this.getPublicUrl();
        post["permalink"] = `${publicUrl}${publicUrl[publicUrl.length - 1] === "/" ? "" : "/"}${
          this.config["useHashRouting"] ? "#/" : ""
        }blog/${found[1]}/${found[2]}/${found[3]}/${post["slug"]}`;
        post["locallink"] = `${this.config["useHashRouting"] ? "#/" : ""}/blog/${found[1]}/${found[2]}/${found[3]}/${
          post["slug"]
        }`;
      } else {
        console.warn(`${filename} contained a permalink - YMMV`);
        post["locallink"] = post["permalink"];
      }
      return post;
    } else {
      console.error(`Failed to parse markdown header for ${filename}`);
      return null;
    }
  }

  removeBody(_post) {
    let post = JSON.parse(JSON.stringify(_post));
    delete post["body"];
    return post;
  }

  generateIndexJson(RawSource, compilation, posts) {
    const indexContent = JSON.stringify(posts);
    compilation.emitAsset(this.options.indexFile, new RawSource(indexContent));
  }

  getPublicUrl() {
    var publicUrl = this.options.paths.publicUrlOrPath;
    if (Object.hasOwn(this.config, "baseUrl")) {
      publicUrl = this.config.baseUrl;
    } else {
      if (!URL.canParse(publicUrl)) {
        console.error(
          `Can't find base URL. Set 'baseUrl' in the config JSON (${this.options.configFile}) -- Not generating feed XML`
        );
        return;
      }
    }
    return publicUrl;
  }
  generateFeedXml(RawSource, compilation, posts) {
    var publicUrl = this.getPublicUrl();

    var feedContent = '<feed xmlns="http://www.w3.org/2005/Atom">';
    feedContent += '<generator uri="https://github.com/VlinderSoftware/phoenix.ui">Phoenix.ui</generator>';
    feedContent += `<link href="${publicUrl}${
      publicUrl[publicUrl.length - 1] === "/" ? "" : "/"
    }feed.xml" rel="self" type="application/atom+xml"/>`;
    feedContent += `<link href="${publicUrl}" rel="alternate" type="text/html"/>`;
    feedContent += `<updated>${new Date().toISOString()}</updated>`;
    feedContent += `<id>${publicUrl}${publicUrl[publicUrl.length - 1] === "/" ? "" : "/"}${this.options.feedFile}</id>`;
    feedContent += `<title type="html">${this.config.title}</title>`;
    feedContent += `<subtitle>${this.config.subtitle}</subtitle>`;

    for (const post of posts) {
      feedContent += `<entry>`;
      feedContent += `<title type="html">${post["title"]}</title>`;
      const permalink = Object.keys(post).includes("permalink")
        ? post["permalink"]
        : `${publicUrl}${publicUrl[publicUrl.length - 1] === "/" ? "" : "/"}blog/${post["date"].replaceAll("-", "/")}/${
            post["slug"]
          }`;
      feedContent += `<link href="${permalink}"></link>`;
      feedContent += `<published>${new Date(Date.parse(post["date"])).toISOString()}</published>`;
      feedContent += `<updated>${new Date(Date.parse(post["date"])).toISOString()}</updated>`;
      feedContent += `<id>${permalink}</id>`;
      feedContent += `<content type="html" xml:base="${permalink}"><![CDATA[ ${this.fromMarkdown(
        post["excerpt"]
      )} ]]></content>`;
      feedContent += `</entry>`;
    }

    feedContent += `</feed>`;

    compilation.emitAsset(this.options.feedFile, new RawSource(feedContent));
  }

  apply(compiler) {
    const pluginName = BuildPosts.name;

    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    const { webpack } = compiler;

    // Compilation object gives us reference to some useful constants.
    const { Compilation } = webpack;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;

    // Tapping to the "thisCompilation" hook in order to further tap
    // to the compilation process on an earlier stage.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // parse the input markdown and generate the asset versions
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          // fetch all the markdown files in the input directory
          // make sure it's a directory

          let fromDirName = this.options.from;
          if (fromDirName[0] !== "/") {
            fromDirName =
              this.options.paths.appPath +
              (this.options.paths.appPath[this.options.paths.appPath.length - 1] === "/" ? "" : "/") +
              fromDirName;
          }
          if (!fs.statSync(fromDirName).isDirectory()) {
            console.error(`${this.options.from} is not a directory`);
            throw new Error(`${this.options.from} is not a directory`);
          }
          if (fromDirName[fromDirName.length - 1] !== "/") {
            fromDirName += "/";
          }

          const filenames = globSync(`${fromDirName}*.{md,markdown}`);
          filenames.forEach((filename) => {
            const post = this.parseInputMarkdown(filename);
            if (post) {
              this.posts[post["filename"]] = post;
              compilation.emitAsset(
                `${this.options.to}${this.options.to[this.options.to.length - 1] === "/" ? "" : "/"}${
                  post["filename"]
                }`,
                new RawSource(post["body"])
              );
            }
          });
        }
      );

      // create the index
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,

          // Using one of the later asset processing stages to ensure
          // that all assets were already added to the compilation by other plugins.
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          var posts = [];
          Object.values(this.posts).forEach((post) => {
            posts.push(this.removeBody(post));
          });
          posts = posts.sort((lhs, rhs) => {
            return rhs["filename"].localeCompare(lhs["filename"]);
          });

          this.generateIndexJson(RawSource, compilation, posts);
        }
      );

      // create the feed XML
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,

          // Using one of the later asset processing stages to ensure
          // that all assets were already added to the compilation by other plugins.
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          var posts = [];
          Object.values(this.posts).forEach((post) => {
            posts.push(this.removeBody(post));
          });
          posts = posts.sort((lhs, rhs) => {
            return rhs["filename"].localeCompare(lhs["filename"]);
          });

          return this.generateFeedXml(RawSource, compilation, posts);
        }
      );
    });
  }
}

module.exports = { BuildPosts };
