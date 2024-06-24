
export const getCategoryPosts = async (after=null) => {
  const params = {
    query: `
    query GetEvents($after: String) {
      category(id: "5", idType: DATABASE_ID) {
        name
        posts(first: 10, after: $after) {
          edges {
            node {
              title
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
                date
              slug
            }
            cursor
          }
        }
        count
      }
    }
  `, variables: {
      after
    },
  };




  const response = await fetch(process.env.WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();
  const posts = result.data.category.posts.edges;

  // Process posts
  posts.forEach(post => {
    // console.log("NODE TITLE", post.node.title);
  });

  // Update the `after` variable for the next request
  if (posts.length > 0) {
    after = posts[posts.length - 1].cursor;
    // console.log("AFTER", after);
  }
posts.after = after;
  // console.log("POSTNODE", posts[0])

  return posts;
}













