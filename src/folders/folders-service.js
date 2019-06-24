const xss = require('xss')

const FoldersService = {
  getAllFolders(db) {
    return db
      .from('folders')
      .select(
        'folders.id',
        'folders.folder_name'
      )
      .orderBy('folders.id')
  },

  getFolderById(db, id) {
    return FoldersService.getAllFolders(db)
      .where('folders.id', id)
      .first()
  },

  serializeFolders(folders) {
    return folders.map(this.serializeFolder)
  },

  serializeFolder(folder) {
    return {
      id: folder.id,
      folder_name: xss(folder.folder_name)
    }
  }
}

module.exports = FoldersService