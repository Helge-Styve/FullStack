const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log("ID:"+id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log("Before:"+persons)
  persons = persons.filter(person => person.id !== id)
  console.log("After:"+persons)

  response.status(204).end()
})

const generateId = () => {

    const min = 1;
    const max = 1000000 ;
    const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(randomInteger)
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log("POst",body)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Content missing' 
    })
  }

  const pers = persons.find(person => person.name === body.name)
  if (pers) {  
      return response.status(400).json({ 
        error: 'name must be unique' 
    })
  }
  

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/info', (request, response) => {
  
  const now = new Date();
  const text="<p>Phonebook has info of "+persons.length+" users</p><p>"+now+"</p>"
  response.send(text)
  

})