const express = require('express')
const path = require('path')
const StepsService = require('./steps-service')

const stepsRouter = express.Router()
const jsonParser = express.json()

stepsRouter.route('/')
  .get((req, res, next) => {
    StepsService.getAllSteps(req.app.get('db'))
      .then(steps => {
        res.json(StepsService.serializeSteps(steps))
      })
      .catch(next)
  })
  // NOTE: THIS IS ONLY ABLE TO POST ONE OBJECT AT A TIME.
  //       HAVE TO FIGURE OUT HOW TO POST ARRAY OF OBJECTS?
  //       BUT I CAN KEEP POSTING MORE OBJECTS...
  .post(jsonParser, (req, res, next) => {
    StepsService.insertSteps(
      req.app.get('db'),
      req.body
    )
      .then(step => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/step/${step.id}`)
          .json(StepsService.serializeStep(step))
      })
  })

stepsRouter.route('/:rcp_id')
  .all(checkRcpExists)
  .get((req, res) => {
    return res.json(StepsService.serializeSteps(res.rcp))
  })

stepsRouter.route('/step/:step_id')
  .all(checkStepExists)
  .patch(jsonParser, (req, res, next) => {
    const { recipe_id, sort_order, step } = req.body
    const stepToUpdate = { recipe_id, sort_order, step }
    const numberOfValues = Object.values(stepToUpdate).filter(Boolean).length

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain either 'recipe_id', 'sort_order', or 'step'.` }
      })
    }
    StepsService.updateSteps(
      req.app.get('db'),
      req.params.step_id,
      stepToUpdate
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })
  .delete((req, res, next) => {
    StepsService.deleteSteps(
      req.app.get('db'),
      req.params.step_id
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })

async function checkRcpExists(req, res, next) {
  try {
    const rcp = await StepsService.getStepByRcpId(
      req.app.get('db'),
      req.params.rcp_id
    )
    if (!rcp) {
      return res.status(404).json({
        error: `Recipe doesn't exist.`
      })
    }
    res.rcp = rcp
    next()
  } catch (error) {
    next(error)
  }
}

async function checkStepExists(req, res, next) {
  try {
    const step = await StepsService.getStepById(
      req.app.get('db'),
      req.params.step_id
    )
    if (!step) {
      return res.status(404).json({
        error: `Step doesn't exist.`
      })
    }
    res.step = step
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = stepsRouter
  