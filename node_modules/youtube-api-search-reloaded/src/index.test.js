import dotenv from 'dotenv';
import { youtubeSearch } from './index';

dotenv.config();

const { API_KEY } = process.env;

describe('YoutubeSearch', () => {
  it('Returns error if required parameters are not passed in', () => youtubeSearch({
    key: API_KEY,
    term: 'John Cena',
    part: 'snippet',
  }).catch((error) => {
    expect(error).toEqual(new Error('Please make sure that the required fields are inserted'));
  }));

  it('Return correct data when arguments are correct', () => youtubeSearch({
    key: API_KEY,
    term: 'John Cena',
    part: 'snippet',
    type: 'video',
  })
    .then((data) => expect(data).toEqual(expect.anything()))
    .catch((error) => expect(error).toBeNull()));
});
