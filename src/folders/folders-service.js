const xss = require('xss')

const FoldersServices = {
  getAllFolders(db) {
    return db
      .from('folders AS fld')
      .select(
        'fld.id',
        'fld.folder_name'
      )
      .orderBy('fld.id')
  },

  getFolderById(db, id) {
    return FoldersServices.getAllFolders(db)
      .where('fld.id', id)
      .first()
  },

  insertFolder(db, newFolder) {
    return db
      .insert(newFolder)
      .into('folders')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  updateFolder(db, id, newFolderFields) {
    return db('folders').where({ id }).update(newFolderFields)
  },

  deleteFolder(db, id) {
    return db('folders').where({ id }).delete()
  },

  serializeFolders(folders) {
    return folders.map(this.serializeFolder)
  },

  serializeFolder(folder) {
    return {
      id: folder.id,
      folder_name: xss(folder.folder_name)
    }
  },
}

module.exports = FoldersServices