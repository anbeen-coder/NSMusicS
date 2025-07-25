import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

export class Medias_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getMedias(
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string,
    year: string,
    album_id: string,
    artist_id: string,
    suffix: string,
    min_bitrate: string,
    max_bitrate: string,
    folder_path: string
  ): Promise<any> {
    return this.sendRequest('GET', 'medias', {
      start,
      end,
      sort,
      order,
      starred,
      search,
      year,
      album_id,
      artist_id,
      suffix,
      min_bitrate,
      max_bitrate,
      folder_path,
    })
  }
  public async getMedia_Ids(ids: string): Promise<any> {
    return this.sendRequest('GET', 'medias/ids', {
      ids,
    })
  }
  public async getMediasSort(
    start: string,
    end: string,
    multi_sorts: string,
    starred: string,
    search: string,
    year: string,
    album_id: string,
    artist_id: string,
    suffix: string,
    min_bitrate: string,
    max_bitrate: string,
    folder_path: string
  ): Promise<any> {
    const params: Record<string, string | string[]> = {
      start,
      end,
      starred,
      search,
      year,
      album_id,
      artist_id,
      suffix,
      min_bitrate,
      max_bitrate,
      folder_path,
    }
    return this.sendRequest('GET', 'medias/sort', params, undefined, multi_sorts)
  }
  public async getMediaCounts(): Promise<any> {
    return this.sendRequest('GET', 'medias/filter_counts')
  }
  public async getMedias_Playlist(
    playlistId: string,
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string,
    year: string,
    album_id: string,
    artist_id: string,
    suffix: string,
    min_bitrate: string,
    max_bitrate: string,
    folder_path: string
  ): Promise<any> {
    return this.sendRequest('GET', 'playlists/tracks', {
      playlistId,
      start,
      end,
      sort,
      order,
      starred,
      search,
      year,
      album_id,
      artist_id,
      suffix,
      min_bitrate,
      max_bitrate,
      folder_path,
    })
  }
  public async getMedias_PlaylistSort(
    playlistId: string,
    start: string,
    end: string,
    multi_sorts: string,
    starred: string,
    search: string,
    year: string,
    album_id: string,
    artist_id: string,
    suffix: string,
    min_bitrate: string,
    max_bitrate: string,
    folder_path: string
  ): Promise<any> {
    const params: Record<string, string | string[]> = {
      playlistId,
      start,
      end,
      starred,
      search,
      year,
      album_id,
      artist_id,
      suffix,
      min_bitrate,
      max_bitrate,
      folder_path,
    }
    return this.sendRequest('GET', 'playlists/tracks/sort', params, undefined, multi_sorts)
  }
}
