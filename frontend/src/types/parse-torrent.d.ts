declare module 'parse-torrent' {
  interface ParsedTorrent {
    name: string
    infoHash: string
    infoHashBuffer: Buffer
    length: number
    files: Array<{
      path: string
      name: string
      length: number
      offset: number
      pathname: string
    }>
    pieceLength: number
    pieces: string[]
    created?: Date
    createdBy?: string
    announce?: string
    announceList?: string[][]
    urlList?: string[]
    info?: Buffer
  }

  function parseTorrent(torrent: Buffer | Uint8Array | string | File | object): ParsedTorrent

  namespace parseTorrent {
    function toMagnetURI(torrent: ParsedTorrent | object): string
    function toTorrentFile(parsed: ParsedTorrent | object): Buffer
    function remote(torrent: string | Buffer | Uint8Array | ParsedTorrent, opts?: object, cb?: Function): void
  }

  export = parseTorrent
}
