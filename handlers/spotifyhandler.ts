import * as needle from 'needle';
import * as tokens from '../tokens.json';
import { Song } from '../interfaces/Song'
import * as search from 'yt-search';
module.exports = {
    name: "Queue Register",
    description: "Registers queue variables",
    execute: execute
}
async function execute(url: string) : Promise<Song[]> {
    if (!url) return [];
    var chunks: string[] = url.split('/');
    var playlist_id : string = chunks[chunks.length -1].split('?')[0];
    var token = await spotAuth();
    var spotRes = await needle('get', 'https://api.spotify.com/v1/playlists/' + playlist_id, { headers: {
        'Authorization': 'Bearer ' + token
    }});
    var songs: Song[] = [];
    for (var track of spotRes.body.tracks.items) {
        search(track.track.name, { type: 'video' }).then(async (res: any) => {
            if (res.videos[0] != undefined) {
                songs.push(new Song({
                    title: track.track.name, 
                    url: res.videos[0].url, 
                    duration: (track.duration_ms/1000), 
                    artist: track.track.artists[0].name, 
                    album: track.track.album.name, 
                    thumbnail: track.track.album.images[0].url
                }))
            }
        });
    }
    return songs;

    

}



async function spotAuth() :Promise<string> {             // according to the spotify api need to get a new key every hour. To get a key must make a post to a url with a base64 encoded string
    const authparams = {
        'grant_type': 'client_credentials',
    }
    var encoded: Buffer = Buffer.from(tokens.spotify_id + ':' + tokens.spotify_secret)
    const authres = await needle("post", 'https://accounts.spotify.com/api/token',authparams, { headers: { 
        'Authorization': 'Basic ' + encoded.toString('base64'),
    }})
    return authres.body.access_token
}