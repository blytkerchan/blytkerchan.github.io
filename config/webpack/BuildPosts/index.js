const fs = require('fs');

class BuildPosts {
  static defaultOptions = {
    posts: '_posts',
    indexFile: '_posts/index.json',
    feedFile: 'feed.xml',
    configFile: 'blog.json',
  };

  constructor(options = {}) {
    this.options = { ...BuildPosts.defaultOptions, ...options };
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
      // Tapping to the assets processing pipeline on a specific stage.
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,

          // Using one of the later asset processing stages to ensure
          // that all assets were already added to the compilation by other plugins.
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          var posts = [];
          
          Object.keys(assets).forEach((assetName) => {
            if (assetName.startsWith(this.options.posts)) {
              const asset = assets[assetName];
              const buffer = asset.buffer();
              const str = buffer.toString();
              const lines = str.split('\n');

              const ParserState = Object.freeze({
                INITIAL: 0,
                PARSING_METADATA: 1,
                PARSING_MULTI_LINE_VALUE : 2,
                PARSING_ARRAY: 3,
                DONE: 4,
                ERROR: 5,
              });
              var nonEmptyLineSeen = false;
              var parserState = ParserState.INITIAL;
              var parsingValueName = '';
              var parsingValue;
              var parsing = {}

              lines.forEach((line) => {
                if (line.length > 0) {
                  const startsWithWhiteSpace = line !== line.trimStart();
                  if (!startsWithWhiteSpace && parserState == ParserState.PARSING_MULTI_LINE_VALUE) {
                    parsing[parsingValueName] = parsingValue.join('\n');
                    parserState = ParserState.PARSING_METADATA;
                  }
                  else if (!line.startsWith('- ') && parserState == ParserState.PARSING_ARRAY) {
                    parsing[parsingValueName] = parsingValue;
                    parserState = ParserState.PARSING_METADATA;
                  }
                  switch (parserState) {
                    case ParserState.INITIAL:
                      if (!nonEmptyLineSeen && (line.trimEnd() === '---')) {
                        parserState = ParserState.PARSING_METADATA;
                      }
                      break;
                    case ParserState.PARSING_METADATA :
                      if (line.trimEnd() === '---') {
                        parserState = ParserState.DONE;
                      }
                      else if (!startsWithWhiteSpace) {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex < 0) {
                          parserState = ParserState.ERROR;
                        }
                        else {
                          parsingValueName = line.slice(0, colonIndex).trim();
                          parsingValue = line.slice(colonIndex + 1).trim();
                          if (parsingValue === '|') {
                            parserState = ParserState.PARSING_MULTI_LINE_VALUE;
                            parsingValue = [];
                          }
                          else if (parsingValue.length === 0) {
                            parserState = ParserState.PARSING_ARRAY;
                            parsingValue = [];
                          }
                          else {
                            parsing[parsingValueName] = parsingValue;
                          }
                        }
                      }
                      else {
                        parserState = ParserState.ERROR;
                      }
                      break;
                    case ParserState.PARSING_MULTI_LINE_VALUE :
                      line = line.trim();
                      parsingValue.push(line);
                      break;
                    case ParserState.PARSING_ARRAY :
                      line = line.slice(2);
                      line = line.trim();
                      parsingValue.push(line);
                      break;
                    }
                  nonEmptyLineSeen = true;
                }
              });
              parsing['filename'] = assetName;
              posts.push(parsing);
            }
          });

          let configFileName = this.options.configFile;
          if (configFileName[0] !== '/') {
            configFileName = this.options.paths.appPath + (this.options.paths.appPath[this.options.paths.appPath.length - 1] === '/' ? '' : '/') + configFileName;
          }
          const config = JSON.parse(fs.readFileSync(configFileName));

          const indexContent = JSON.stringify(posts);
          var feedContent = '<feed xmlns="http://www.w3.org/2005/Atom">';
          feedContent += '<generator uri="https://github.com/VlinderSoftware/phoenix.ui">Phoenix.ui</generator>';
          feedContent += `<link href="${this.options.paths.publicUrlOrPath}${this.options.paths.publicUrlOrPath[this.options.paths.publicUrlOrPath.length - 1] === '/' ? '' : '/'}feed.xml" rel="self" type="application/atom+xml"/>`
          feedContent += `<link href="${this.options.paths.publicUrlOrPath}" rel="alternate" type="text/html"/>`
          feedContent += `<updated>${(new Date()).toISOString()}</updated>`
          feedContent += `<id>${this.options.paths.publicUrlOrPath}${this.options.paths.publicUrlOrPath[this.options.paths.publicUrlOrPath.length - 1] === '/' ? '' : '/'}${this.options.feedFile}</id>`
          feedContent += `<title type="html">${config.title}</title>`
          feedContent += `<subtitle>${config.subtitle}</subtitle>`
// serialize entries here

          feedContent += `</feed>`

          compilation.emitAsset(
            this.options.indexFile,
            new RawSource(indexContent)
          );
          compilation.emitAsset(
            this.options.feedFile,
            new RawSource(feedContent)
          );
        }
      );
    });
  }
}

module.exports = { BuildPosts };