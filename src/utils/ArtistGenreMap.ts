class ArtistGenreMap {
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

  getGenresForArtists(artistIds: string[]): string[] {
    const genres: string[] = [];
    for (const artistId of artistIds) {
      genres.push(...this.getGenresForArtist(artistId));
    }

    return [...new Set(genres)];
  }

  hasGenre(artistIds: string[], genre: string) {
    const genres = this.getGenresForArtists(artistIds);
    return genres.includes(genre);
  }
}

const artistGenreMap = new ArtistGenreMap();
export { artistGenreMap };
