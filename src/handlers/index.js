import { GetObjectCommand, MetadataDirective, S3Client } from "@aws-sdk/client-s3";
import env from "../config/environment";

const client = new S3Client({});

export async function rewriteMetaData(event, context) {
  try {
    const s3BucketName = event.Records[0].cf.request.origin.custom.domainName.replace(/\.s3\.amazonaws\.com$/, "");
    const requestUri = event.Records[0].cf.request.uri;
    var locallink = null;
    if (env.useHashRouting) {
      locallink = requestUri.substring(1);
    } else {
      locallink = requestUri;
    }
    var filename = `meta/${locallink.replace(/^[^0-9]+/, "").replace(/\//g, "-")}.json`;
    console.log(filename);

    const getIndexCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: "index.html",
    });
    const getMetaDataCommand = new GetObjectCommand({
      Bucket: s3BucketName,
      Key: filename,
    });

    var indexBody;
    try {
      console.log(`Downloading index.html`);
      const indexCommandResponse = await client.send(getIndexCommand);
      indexBody = await indexCommandResponse.Body.transformToString();
    } catch (e) {
      console.error(JSON.stringify(e));
      throw e;
    }

    var meta;
    try {
      console.log(`Downloading ${filename}`);
      const metaDataCommandResponse = await client.send(getMetaDataCommand);
      const metaDataBody = await metaDataCommandResponse.Body.transformToString();
      meta = JSON.parse(metaDataBody);
    } catch (e) {
      console.error(JSON.stringify(e));
      throw e;
    }

    var metaTags = "";
    if ("title" in meta) {
      metaTags += `<title>${meta["title"]}</title>`;
      metaTags += `<meta property="og:title" content="${meta["title"]}"/>`;
      metaTags += `<meta property="twitter:title" content="${meta["title"]}"/>`;
    }

    metaTags += `<meta property="og:type" content="website"/>`;
    metaTags += `<meta name="twitter:card" content="summary_large_image"/>`;

    if ("description" in meta) {
      metaTags += `<meta name="description" content="${meta["description"]}"/>`;
      metaTags += `<meta property="og:description" content="${meta["description"]}"/>`;
      metaTags += `<meta name="twitter:description" content="${meta["description"]}"/>`;
    }

    const domain = s3BucketName; // by convention, these are the same
    metaTags += `<meta property="twitter:domain" content="${domain}"/>`;
    metaTags += `<meta property="og:url" content="https://${domain}${requestUri}"/>`;
    metaTags += `<meta property="twitter:url" content="https://${domain}${requestUri}"/>`;

    if ("thumbnail" in meta) {
      metaTags += `<meta property="og:image" content="${meta["thumbnail"]}"/>`;
      metaTags += `<meta property="twitter:image" content="${meta["thumbnail"]}"/>`;
    }

    const content = indexBody.replace(/<metadata\s*\/>/, metaTags);

    const response = {
      status: "200",
      statusDescription: "OK",
      headers: {
        "cache-control": [
          {
            key: "Cache-Control",
            value: "max-age=100",
          },
        ],
        "content-type": [
          {
            key: "Content-Type",
            value: "text/html",
          },
        ],
      },
      body: content,
    };
    return response;
  } catch (e) {
    console.error(JSON.stringify(e));
    throw e;
  }
}
