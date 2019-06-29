const xss = require('xss')

const StepsService = {
  getAllSteps(db) {
    return db
      .select('*')
      .from('steps')
      .orderBy('steps.recipe_id', 'steps.sort_order')
  },

  getStepByRcpId(db, rcp_id) {
    return StepsService.getAllSteps(db)
      .where('steps.recipe_id', rcp_id)
      .orderBy('steps.sort_order')
  },

  getStepById(db, step_id) {
    return StepsService.getAllSteps(db)
      .where('steps.id', step_id)
      .orderBy('steps.sort_order')
  },

  insertSteps(db, newSteps) {
    return db
      .insert(newSteps)
      .into('steps')
      .returning('*')
      .then(rows => rows[0])
  },

  updateSteps(db, id, stepToUpdate) {
    return db('steps').where({ id }).update(stepToUpdate)
  },

  deleteSteps(db, id) {
    return db('steps').where({ id }).delete()
  },

  serializeSteps(steps) {
    return steps.map(this.serializeStep)
  },

  serializeStep(step) {
    return {
      id: step.id,
      recipe_id: step.recipe_id,
      sort_order: step.sort_order,
      step: xss(step.step)
    }
  }
}

module.exports = StepsService