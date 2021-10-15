export const youtubeListApi = async (youtubeApiFunction, props) => {
  let pageToken = undefined;
  let hasNextPage = true;
  let results = [];

  while (hasNextPage) {
    try {
      const response = await youtubeApiFunction({
        ...props,
        pageToken: pageToken
      });
      pageToken = response.result.nextPageToken;
      hasNextPage = !!pageToken;
      results = [...results, response.result];
    } catch (e) {
      throw e;
    }
  }
  return results;
}