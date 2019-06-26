const express = require('express')
const path = require('path')
const FoldersServices = require('./folders-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter.route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
    FoldersServices.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(FoldersServices.serializeFolders(folders))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    console.log('req.body', req.body)

    for (const [key, value] of Object.entries(req.body)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key} in request body.` }
        })
      }
    }
    FoldersServices.insertFolder(
      req.app.get('db'),
      req.body
      )
      .then(folder => {
        res.status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(FoldersServices.serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter.route('/:folder_id')
  // .all(requireAuth)
  .all(checkFolderExists)
  .get((req, res) => {
    return res.json(FoldersServices.serializeFolder(res.folder))
  })
  .patch(jsonParser, (req, res, next) => {
    const db = req.app.get('db')
    const folder_id = req.params.folder_id
    const name = req.body
    const folderToUpdate = name
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if(numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body is empty.` }
      })
    }
    FoldersServices.updateFolder(db, folder_id, folderToUpdate)
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })
  .delete((req, res, next) => {
    FoldersServices.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => res.status(204).end)
      .catch(next)
  })

async function checkFolderExists(req, res, next) {
  try {
    const folder = await FoldersServices.getFolderById(
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