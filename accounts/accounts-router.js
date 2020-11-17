const express = require('express')
const db = require('../data/dbConfig')
const router = express.Router()

const { check, validationResult } = require('express-validator')

db.on('query', data => console.log(data.sql))

router.get('/', async (req, res) => {

  try {
    const sql = await db('accounts').toString()
    const accounts = await db('accounts')
    res.json(accounts)
  }

  catch (error){
    console.log(error)
    res.status(500).json({ message: 'database error' })
  }

})

router.get('/:id', [

  check('id')
    .isNumeric()
    .isLength({ min: 1 })

],async (req, res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    const {id} = req.params
    res.status(422).json({ errors: errors.array() })
  }

  else{

    try {
      const [account] = await db('accounts').first().where({ id })

      if(account){
        res.json(account)
      }

      else{
        res.status(404).json({ message: 'Could not find an account with that id' })
      }

    } catch (error) {
      res.status(500).json({ message: 'failed to get account' })
    }

  }

})

router.post('/', [
  check('id')
    .isNumeric()
    .isLength({ min: 1 }),
  check('name')
    .isAlpha()
    .isLength({ min: 1 }),
  check('budget')
    .isNumeric()
    .isLength({ min: 1 })
], async (req, res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    res.status(422).json({ errors: errors.array() })
  }

  else{

    const postData = req.body

    try {
      const account = await db('accounts').insert(postData)
      res.status(201).json(post)
    } catch (error) {
      res.status(500).json({ message: 'database error', error: error })
    }

  }
})

router.put('/:id', [
  check('id')
    .isNumeric()
    .isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    res.status(422).json({ errors: errors.array() })
  }

  else{

    const {id} = req.params
    const changes = req.body

    try{
      const count = await db('accounts').update()

      if(count){
        res.json({ update: count })
      }

      else{
        res.status(404).json({ message: 'not found' })
      }
    }

    catch(error){
      res.status(500).json({ message: 'server error', error: error })
    }
  }
})

router.delete('/:id', [
  check('id')
    .isNumeric()
    .isLength({ min: 1 })
], async (req, res) => {

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    res.status(422).json({ errors: errors.array() })
  }

  else{

    const {id} = req.params

    try {

      const count = await db('accounts').del().where({id})

      if(count){
        res.json({ deleted: count })
      }

    } catch (error) {

      res.status(404).json({ message: 'error', error: error })
    }
  }
})

module.exports = router