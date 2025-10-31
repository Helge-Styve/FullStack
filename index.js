require('dotenv').config()
const express = require('express')

const Person = require('./models/person')
const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

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


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/', (request, response) => {
  response.send('<h1>Hello World!!</h1>')
})

//const PORT = 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



app.delete('/api/persons/:id', (request, response, next) => {
  console.log("ID:",request.params.id)
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  console.log("ID:",request.params.id)
  Person.findById(request.params.id)
    .then((person) => {

      if(person){
         response.json(person)
      }
      response.status(404).end()
    })
    .catch((error) => next(error))
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


  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  console.log("xx name:",name)
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


app.get('/api/info', (request, response) => {
  
  const now = new Date();

  Person.find({}).then((person) => {
      if(person){
          const text="<p>Phonebook has info of "+person.length+" users</p><p>"+now+"</p>"
          response.send(text)
      }
      response.status(404).end()
    })
    .catch((error) => next(error))
  }  
)
  



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
