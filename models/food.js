const db = require('../config/db')

const foodModel = {
  getFood: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM food', (err, result) => {
        if (!err) {
          resolve(result.rows)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  insert: (body) => {
    const { title, ingrediens = [], video, image } = body
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO food (title, ingrediens, video, image) VALUES ($1,$2,$3,$4)',
        [title, ingrediens, video, image],
        (err, result) => {
          if (!err) {
            resolve(result.rows)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  },
  update: ({ title, ingrediens, video, image, idfood }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE food SET title = $1,  ingrediens = $2, video = $3, image = $4 WHERE idfood = $5',
        [title, ingrediens, video, image, idfood],
        (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  },
  deleteFood: (idfood) => {
    return db.query('DELETE FROM food WHERE idfood = $1', [idfood])
  },
  filterFood: ({ search, sort = 'title', type = 'ASC', limit, offset }) => {
    return db.query(
      `SELECT * FROM food WHERE ${sort} ILIKE $1 ORDER BY ${sort} ${type} LIMIT $2 OFFSET $3`,
      ['%' + search + '%', limit, offset]
    )
  },
  getDetail: (idfood) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM food WHERE idfood = $1',
        [idfood],
        (err, result) => {
          if (!err) {
            resolve(result.rows)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  },
  countFood: () => {
    return db.query('SELECT COUNT(*) AS total FROM food')
  }
}

module.exports = {
  foodModel
}
