import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";

export const getPage = async (uri) => {
  const params = {
    query: `
      query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
        __typename
          ... on Page {
           title
            date
            blocksJSON
            blocks {
              ... on CoreLatestPostsBlock {
                dynamicContent
              }
              ... on CoreVideoBlock {
                originalContent
              }
            }
          }
          ... on Post {
            id
            title
            date
            blocks {
              ... on CoreLatestPostsBlock {
                dynamicContent
              }
              ... on CoreVideoBlock {
                originalContent
              }
            }
            blocksJSON
          }
          
        }
      }
    `,
    variables: {
      uri,
    },
  };

    const response = await fetch(process.env.WP_GRAPHQL_URL, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(params)
    });
    
    const { data } = await response.json();
    // console.log("GETPAGE", data)
    if (!data.nodeByUri) {
        return null;
    }

    // console.log("FIND DATA", data, "END DATA")
    const blocks = cleanAndTransformBlocks(data.nodeByUri.blocksJSON);
// console.log("TITLE",data.nodeByUri.__typename)
    return {
      props: {
               blocks,
        propertyFeatures: data.nodeByUri.propertyFeatures || null,
        title: data.nodeByUri.title || "",
        date: data.nodeByUri.date || "",
        __typename: data.nodeByUri.__typename
     
      },
    };

}