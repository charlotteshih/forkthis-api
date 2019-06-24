const express = require('express')
const FoldersService = require('./folders-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const foldersRouter = express.Router()

foldersRouter.route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(FoldersService.serializeFolders(folders))
      })
      .catch(next)
  })

foldersRouter.route('/:folder_id')
  // .all(requireAuth)
  .all(checkFolderExists)
  .get((req, res) => {
    return res.json(FoldersService.serializeFolder(res.folder))
  })
  // .post()

async function checkFolderExists(req, res, next) {
  try {
    const folder = await FoldersService.getFolderById(
      req.app.get('db'),
      req.params.folder_id
    )

    if(!folder) {
      return res.status(404).json({
        error: `Folder doesn't exist.`
      })
    }

    res.folder = folder
    next()
  } catch(error) {
    next(error)
  }
}

module.exports = foldersRouter