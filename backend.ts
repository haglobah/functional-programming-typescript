import { Database } from 'bun:sqlite'

const setup = () => {
  const db = new Database('mydb.sqlite', { create: true })

  const createUsers = db.query(`
CREATE TABLE users (
  id string PRIMARY KEY,

  name integer NOT NULL)
`)
  createUsers.run()

  const addUser = db.query(`
INSERT INTO users (id, name) VALUES (?, ?)
`)

  addUser.run('qwfparstoienarst', 'beat')
  db.close(false)
}

const main = () => {
  const db = new Database('mydb.sqlite')

  const selectUsers = db.query('select * from users')

  console.log(selectUsers.all())

  db.close(false)
}

main()
