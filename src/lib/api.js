export const youtubeListApi = async (youtubeApiFunction, props, progressFn) => {
  let pageToken = undefined;
  let hasNextPage = true;
  let results = [];

  while (hasNextPage) {
    try {
      const propsWithPageToken = { ...props, pageToken: pageToken };
      const response = await youtubeApiFunction(propsWithPageToken);
      pageToken = response.result.nextPageToken;
      if (typeof progressFn === "function") {
        progressFn(response.result.pageInfo.totalResults, response.result.items.length);
      }
      hasNextPage = !!pageToken;
      results = [...results, ...response.result.items];
    } catch (e) {
      throw e;
    }
  }
  return results;
}