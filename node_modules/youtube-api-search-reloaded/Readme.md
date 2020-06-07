# Youtube seach

[![Build Status](https://travis-ci.org/iTsFILIPOficial/youtube-api-search-reloaded.svg?branch=master)](https://travis-ci.org/iTsFILIPOficial/youtube-api-search-reloaded)
[![Coverage Status](https://coveralls.io/repos/github/iTsFILIPOficial/youtube-api-search-reloaded/badge.svg?branch=master)](https://coveralls.io/github/iTsFILIPOficial/youtube-api-search-reloaded?branch=master)
[![Size](https://badgen.net/bundlephobia/min/youtube-api-search-reloaded)](https://bundlephobia.com/result?p=youtube-api-search-reloaded)

Based on `https://www.npmjs.com/package/youtube-api-search` added all available option in the yotube api.

Avaiable parameters : `https://developers.google.com/youtube/v3/docs/search/list#parameters`

### Required arguments

There are 4 required params there are `part`, `key`, `term` and `type`.

### Example:

```javascript
import YoutubeSearch from "youtube-api-search-reloaded";

const params = {
  part,
  key,
  term,
  type,
  forContentOwner,
  forDeveloper,
  forMine,
  relatedToVideoId,
  channelId,
  channelType,
  eventType,
  location,
  locationRadius,
  maxResults,
  onBehalfOfContentOwner,
  order,
  pageToken,
  publishedAfter,
  regionCode,
  relevanceLanguage,
  safeSearch,
  topicId,
  videoCaption,
  videoCategoryId,
  videoDefinition,
  videoDimension,
  videoDuration,
  videoEmbeddable,
  videoLicense,
  videoSyndicated,
  videoType
};

YoutubeSearch({ params })
  .then(data => handleVideoData(data))
  .catch(error => handleError(error));
```

### License

MIT

### Copyright

iTsFILIPOficial
