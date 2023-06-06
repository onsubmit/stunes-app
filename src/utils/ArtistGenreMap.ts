export class ArtistGenreMap {
  private _map = new Map<string, Set<string>>();

  add = (artistId: string, genres: string[]): void => {
    const mappedGenres = this._map.get(artistId);
    if (mappedGenres) {
      for (const genre of genres) {
        mappedGenres.add(genre);
      }
    } else {
      this._map.set(artistId, new Set(genres));
    }
  };

  getGenresForArtist(artistId: string): string[] {
    const genres = this._map.get(artistId);
    if (!genres) {
      throw new Error(`No genres found for artistId: ${artistId}`);
    }

    return [...genres];
  }
}
